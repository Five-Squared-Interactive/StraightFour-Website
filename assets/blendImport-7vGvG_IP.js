import{t as e}from"./preload-helper-HclGiUj8.js";import{i as t,n,o as r,r as i,t as a}from"./pendingImport-amhuOuq8.js";import{n as o}from"./importServer-BcQNnZ3H.js";import{n as s,newWorldRoom as c,presentStaged as l,showStage as u,stageBuilt as d,t as f}from"./importMode-DSGKMmLU.js";import{f as p,u as m}from"./importEntry-CRMxzGCC.js";var h=`# Copyright (c) 2019-2026 Five Squared Interactive
# SPDX-License-Identifier: MIT

# Headless .blend → glb exporter with realize + bake stages.
#
# Run by src/blend/blend.ts:
#   blender --background --factory-startup --python blend_export.py -- \\
#       <scene.blend> <out.glb> <out.report.json> [bake_resolution] [bake_samples]
#
# Stages (each per-object/per-material failure is TOLERATED: skip + report,
# never die — a real, messy scene must still export):
#   0. dead image references → neutral generated placeholder + report entry
#   1. realize generators: convert every non-mesh renderable (curve/surface/
#      font/meta) and every modifier-carrying mesh to a plain mesh
#   2. bake procedural materials: any material whose Principled BSDF inputs
#      are driven by non-image node chains gets its Base Color / Roughness /
#      Normal / Emission baked to per-material textures (Cycles), then is
#      rewired to a plain Principled + image setup the glTF exporter maps
#   3. glTF export: GLB, punctual lights INCLUDED, export_tangents OFF
#      (tangent export aborts on ngons), Y-up
#   4. report JSON: realized/failed objects, baked materials, dead refs,
#      light count, camera pose converted to VEML space
import bpy
import json
import math
import os
import sys
import traceback

argv = sys.argv[sys.argv.index("--") + 1 :]
BLEND_PATH, OUT_GLB, OUT_REPORT = argv[0], argv[1], argv[2]
# Samples default LOW: every pass here is a DATA bake (diffuse is
# COLOR-filtered — no light transport), so sampling noise is negligible and
# high samples only multiply per-object render time on many-user materials.
BAKE_RES = int(argv[3]) if len(argv) > 3 else 1024
BAKE_SAMPLES = int(argv[4]) if len(argv) > 4 else 4
# Opt out of carrying the viewport's Material-Preview HDRI as the world sky.
NO_LOOKDEV_SKY = len(argv) > 5 and argv[5] == "1"
# The image format the glTF exporter writes textures in. AUTO keeps each
# image's own format; JPEG is for a Blender build that cannot write PNG.
IMAGE_FORMAT = argv[6] if len(argv) > 6 and argv[6] else "AUTO"

EYE_HEIGHT_M = 1.75

report = {
    "realizedObjects": [],
    "failedObjects": [],
    "excludedObjects": [],
    "bakedMaterials": [],
    "bakeFailures": [],
    "skippedMaterials": [],
    "deadReferences": [],
    "recoveredReferences": [],
    "magentaMaterials": [],
    "glassMaterials": [],
    "deadDrivenAdjusted": [],
    "warnings": [],
    "lightCount": 0,
    "camera": None,
    "worldBackground": None,
    "viewportHiddenObjects": [],
    "defaultMaterialAssigned": [],
}

bpy.ops.wm.open_mainfile(filepath=BLEND_PATH)
scene = bpy.context.scene

# Missing LINKED LIBRARIES are silent in Blender (linked collections fall
# back to placeholder data and simply vanish from the render): a scene whose
# \`//../ASSETS/…\` library was left behind when the .blend moved exports
# missing-texture magenta with no explanation. Surface it LOUDLY in the
# report (basename only — never publish the author's filesystem).
for _lib in bpy.data.libraries:
    if not os.path.exists(bpy.path.abspath(_lib.filepath)):
        report["warnings"].append(
            "linked library missing: %s — its linked collections/objects are "
            "placeholders and silently disappear from the export. Keep the library "
            "at the relative path the scene expects (see the scene's File > External Data)."
            % os.path.basename(_lib.filepath.replace("\\\\", "/"))
        )

# ---------------------------------------------------------------- stage 0 ---
# Dead image references. RECOVERY first: a dead ABSOLUTE path (moved drives,
# e.g. G:\\3d_Assets\\...) often still exists next to the scene, so search
# the .blend's own directory tree by basename before giving up.
# Unrecoverable references become MAGENTA placeholders — the same
# missing-texture pink Blender itself shows, so a broken material looks
# identical in the shell and in Blender.
_blend_dir = os.path.dirname(os.path.abspath(BLEND_PATH))


def _find_by_basename(basename):
    lowered = basename.lower()
    for root, _dirs, files in os.walk(_blend_dir):
        for f in files:
            if f.lower() == lowered:
                return os.path.join(root, f)
    return None


_dead_image_names = set()
for img in bpy.data.images:
    if img.source == "FILE" and img.filepath and not img.packed_file:
        abspath = bpy.path.abspath(img.filepath)
        if not os.path.exists(abspath):
            basename = os.path.basename(img.filepath.replace("\\\\", "/"))
            recovered = _find_by_basename(basename) if basename else None
            if recovered:
                report.setdefault("recoveredReferences", []).append(
                    {"from": img.filepath, "to": recovered}
                )
                img.filepath = recovered
                img.reload()
                continue
            report["deadReferences"].append(img.filepath)
            _dead_image_names.add(img.name)
            img.source = "GENERATED"
            img.generated_width = 64
            img.generated_height = 64
            img.generated_color = (1.0, 0.0, 1.0, 1.0)  # Blender missing-texture magenta

# ------------------------------------------------------------- stage 0.5 ---
# Blender renders a material WHOLLY missing-texture magenta when any linked
# image file is dead — wherever the image feeds (an image wired into
# Metallic/Normal is lost entirely by glTF export, leaving gray where
# Blender shows pink). Faithful carry: any material whose ACTIVE surface
# chain contains a still-dead image is rewired to a solid-magenta Principled,
# exactly the look the artist sees until they fix the file.
def _surface_chain_nodes(mat):
    outs = [n for n in mat.node_tree.nodes if n.type == "OUTPUT_MATERIAL"]
    out = next((n for n in outs if getattr(n, "is_active_output", False)), outs[0] if outs else None)
    if out is None:
        return []
    seen, stack, nodes = set(), [out], []
    while stack:
        n = stack.pop()
        if n.name in seen:
            continue
        seen.add(n.name)
        nodes.append(n)
        for inp in n.inputs:
            for link in inp.links:
                stack.append(link.from_node)
    return nodes


if _dead_image_names:
    for mat in bpy.data.materials:
        if not mat.use_nodes or mat.users == 0:
            continue
        chain = _surface_chain_nodes(mat)
        has_dead = any(
            n.type in ("TEX_IMAGE", "TEX_ENVIRONMENT") and n.image is not None and n.image.name in _dead_image_names
            for n in chain
        )
        if not has_dead:
            continue
        nt = mat.node_tree
        # Eevee ground truth (checked A/B against Eevee renders): a dead image
        # paints the surface PINK only when it influences BASE COLOR (or the
        # surface is a non-Principled tree we can't dissect); a dead map
        # feeding Metallic/Roughness/Normal evaluates as the implicit
        # color→scalar of magenta = (1+0+1)/3 = 2/3 over the AUTHORED base —
        # surfaces such as an appliance or a fake-reflection window render as
        # GRAY REFLECTIVE metal in Eevee, not pink. Base-affected → pink rewrite;
        # otherwise → surgical: unlink the dead-driven inputs, convert
        # scalars, keep the rest of the tree for the normal export/bake flow.
        # (Local surface resolve — the stage-2 helpers are defined later.)
        _outs = [n for n in nt.nodes if n.type == "OUTPUT_MATERIAL"]
        _out0 = next((n for n in _outs if getattr(n, "is_active_output", False)), _outs[0] if _outs else None)
        prior = None
        if _out0 is not None and _out0.inputs["Surface"].is_linked:
            prior = _out0.inputs["Surface"].links[0].from_node
            while prior is not None and prior.type == "REROUTE":
                prior = prior.inputs[0].links[0].from_node if prior.inputs[0].is_linked else None
        constants = {}
        dead_driven = set()
        if prior is not None and prior.type == "BSDF_PRINCIPLED":
            for inp in prior.inputs:
                if inp.name in ("Metallic", "Roughness", "IOR", "Alpha") and not inp.is_linked:
                    constants[inp.name] = inp.default_value
                if inp.is_linked:
                    seen, stack = set(), [inp.links[0].from_node]
                    while stack:
                        n = stack.pop()
                        if n.name in seen:
                            continue
                        seen.add(n.name)
                        if n.type in ("TEX_IMAGE", "TEX_ENVIRONMENT") and n.image is not None and n.image.name in _dead_image_names:
                            dead_driven.add(inp.name)
                        for i2 in n.inputs:
                            for l2 in i2.links:
                                stack.append(l2.from_node)
        base_affected = prior is None or prior.type != "BSDF_PRINCIPLED" or "Base Color" in dead_driven
        if base_affected:
            for n in list(nt.nodes):
                if n.type != "OUTPUT_MATERIAL":
                    nt.nodes.remove(n)
            out_node = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
            pink = nt.nodes.new("ShaderNodeBsdfPrincipled")
            pink.inputs["Base Color"].default_value = (1.0, 0.0, 1.0, 1.0)
            for name, val in constants.items():
                if name in pink.inputs:
                    pink.inputs[name].default_value = val
            for name in ("Metallic", "Roughness"):
                if name in dead_driven and name in pink.inputs:
                    pink.inputs[name].default_value = 2.0 / 3.0
            if pink.inputs.get("Roughness") is not None and "Roughness" not in constants and "Roughness" not in dead_driven:
                pink.inputs["Roughness"].default_value = 0.9
            nt.links.new(pink.outputs["BSDF"], out_node.inputs["Surface"])
            report.setdefault("magentaMaterials", []).append(mat.name)
        else:
            # Non-base channels only: Eevee keeps the authored base color.
            for name in dead_driven:
                inp = prior.inputs.get(name)
                if inp is None:
                    continue
                for link in list(inp.links):
                    nt.links.remove(link)
                if name in ("Metallic", "Roughness"):
                    inp.default_value = 2.0 / 3.0
            report.setdefault("deadDrivenAdjusted", []).append(
                {"name": mat.name, "inputs": sorted(dead_driven)}
            )

# Image datablock names with URL-hostile characters ('#', '?', …) can break
# the glTF exporter's image serialization SILENTLY — 3ds-Max-style names
# like 'Map #N' never reach the glb while identically-generated images with
# plain names do. Sanitize names before export (materials link
# images by pointer; renaming is free).
import re as _re

for img in bpy.data.images:
    safe = _re.sub(r"[^\\w. -]", "_", img.name)
    if safe and safe != img.name:
        img.name = safe

# ------------------------------------------------------------ baked light ---
# Light the author baked into an image on the model's second UV layout is
# carried as a picture beside the glb. The client lays it on the second UV
# set and multiplies it by the surface's own colour, so the image must hold
# light only (a Diffuse bake with Direct and Indirect, without Color).
#
# An image is found two ways. By the material's own mark: \`veml_lightmap\`
# names an image in this file. Or by convention: an image whose name starts
# with "lightmap", in an Image Texture node of the material that is not wired
# into the surface, which is what Blender's Bake leaves behind.
#
# This runs before the stages below, which rebuild node trees and would
# discard an unwired node. Each image is written once, as 8 bits: one whose
# values go above 1 is divided by the smallest power of two that holds its
# brightest value, and that number goes on the material as
# \`veml_lightmap_intensity\` so the client multiplies it back. The picture's
# final name is the assembly's to give (a world's files are named by their
# content), so the material carries a key in its place.
LIGHTMAP_KEY = "veml_lightmap"
LIGHTMAP_INTENSITY_KEY = "veml_lightmap_intensity"
LIGHTMAP_NAME_PREFIX = "lightmap"
# Past this the brightest values clip: 16 times white in 8 bits already
# leaves the dim end coarse.
LIGHTMAP_MAX_DIVISOR = 16


def _lightmap_image_named(value):
    """The image a material's mark names: by its name, or by its file's name."""
    wanted = str(value).strip()
    if not wanted:
        return None
    for name in (wanted, _re.sub(r"[^\\w. -]", "_", wanted)):
        img = bpy.data.images.get(name)
        if img is not None:
            return img
    lowered = wanted.lower()
    for img in bpy.data.images:
        base = os.path.basename(img.filepath.replace("\\\\", "/")).lower() if img.filepath else ""
        if img.name.lower() == lowered or base == lowered:
            return img
    return None


def _lightmap_node_by_name(mat):
    """The unwired Image Texture node holding an image named for baked light."""
    if not mat.use_nodes or mat.node_tree is None:
        return None
    wired = {n.name for n in _surface_chain_nodes(mat)}
    found = [
        n
        for n in mat.node_tree.nodes
        if n.type == "TEX_IMAGE"
        and n.image is not None
        and n.name not in wired
        and n.image.name.lower().startswith(LIGHTMAP_NAME_PREFIX)
    ]
    if not found:
        return None
    active = mat.node_tree.nodes.active
    return active if active in found else sorted(found, key=lambda n: n.name)[0]


def _lightmap_layout_problem(mat, node):
    """Why the objects using this material cannot take a picture on their
    second UV layout, or None when they all can."""
    named = None
    if node is not None and node.inputs["Vector"].is_linked:
        source = node.inputs["Vector"].links[0].from_node
        if source.type == "UVMAP" and source.uv_map:
            named = source.uv_map
    for o in scene.objects:
        if not any(slot.material is mat for slot in o.material_slots):
            continue
        if o.type != "MESH":
            return 'it is used by "%s", which is not a mesh and has no second UV layout' % o.name
        layouts = o.data.uv_layers
        if len(layouts) < 2:
            count = "one UV layout" if len(layouts) == 1 else "no UV layout"
            return 'the mesh "%s" has %s; baked light is laid on the second' % (o.name, count)
        if named is not None and layouts[1].name != named:
            return (
                'its image is laid on the UV layout "%s", which is not the second layout of the mesh "%s"'
                % (named, o.name)
            )
    return None


def _lightmap_peak(img):
    """The brightest colour value in a float image."""
    from array import array

    count = img.size[0] * img.size[1] * img.channels
    if count == 0:
        return 0.0
    values = array("f", bytes(4 * count))
    img.pixels.foreach_get(values)
    colours = min(3, img.channels)
    peak = max(max(values[c :: img.channels]) for c in range(colours))
    return peak if math.isfinite(peak) else 0.0


def _write_lightmap(img, path):
    """Write the image as an 8-bit picture and return what it was divided by."""
    divisor = 1
    if img.is_float:
        peak = _lightmap_peak(img)
        while divisor < peak and divisor < LIGHTMAP_MAX_DIVISOR:
            divisor *= 2
        if peak > divisor:
            report["warnings"].append(
                'the baked light "%s" goes up to %.1f times white; above %d it is clipped'
                % (img.name, peak, LIGHTMAP_MAX_DIVISOR)
            )
    view, settings = scene.view_settings, scene.render.image_settings
    before = (view.view_transform, view.look, view.exposure, view.gamma, settings.file_format, settings.color_mode)
    try:
        view.view_transform = "Standard"
        view.look = "None"
        view.exposure = -math.log2(divisor)
        view.gamma = 1.0
        settings.file_format = "JPEG" if IMAGE_FORMAT == "JPEG" else "PNG"
        settings.color_mode = "RGB"
        if settings.file_format == "JPEG":
            settings.quality = 92
        img.save_render(path)
    finally:
        view.view_transform, view.look, view.exposure, view.gamma = before[0], before[1], before[2], before[3]
        settings.file_format = before[4]
        settings.color_mode = before[5]
    if not os.path.isfile(path) or os.path.getsize(path) == 0:
        raise RuntimeError("Blender wrote no picture")
    return divisor


def _carry_lightmaps():
    dead = {_re.sub(r"[^\\w. -]", "_", name) for name in _dead_image_names}
    written = {}  # image name -> its entry in the report
    skipped = []
    extension = "jpg" if IMAGE_FORMAT == "JPEG" else "png"
    for mat in sorted(bpy.data.materials, key=lambda m: m.name):
        if mat.users == 0 or mat.library is not None:
            continue
        marked = LIGHTMAP_KEY in mat.keys()
        authored = mat.get(LIGHTMAP_INTENSITY_KEY) if marked else None
        node, img, reason = None, None, None
        if marked:
            img = _lightmap_image_named(mat[LIGHTMAP_KEY])
            if img is None:
                reason = 'no image named "%s" is in the file' % str(mat[LIGHTMAP_KEY]).strip()
            elif mat.use_nodes and mat.node_tree is not None:
                node = next((n for n in mat.node_tree.nodes if n.type == "TEX_IMAGE" and n.image is img), None)
        else:
            node = _lightmap_node_by_name(mat)
            img = node.image if node is not None else None
        # Whatever happens below, the material leaves with the key this
        # stage gives it or with none: an author's own value names an image
        # in this file, never a file of the world.
        for key in (LIGHTMAP_KEY, LIGHTMAP_INTENSITY_KEY):
            if key in mat.keys():
                del mat[key]
        if img is None and reason is None:
            continue
        if reason is None and (img.name in dead or img.name in _dead_image_names):
            reason = "its image's file is missing"
        if reason is None and (img.size[0] == 0 or img.size[1] == 0 or not img.has_data and img.source != "GENERATED"):
            # has_data is false until an image is first read; ask for it once.
            try:
                img.pixels[0]
            except Exception:  # noqa: BLE001
                pass
            if img.size[0] == 0 or img.size[1] == 0:
                reason = "its image could not be read"
        if reason is None:
            reason = _lightmap_layout_problem(mat, node)
        entry = None
        if reason is None:
            entry = written.get(img.name)
            if entry is None:
                index = len(written)
                path = "%s.lightmap-%d.%s" % (OUT_GLB, index, extension)
                try:
                    divisor = _write_lightmap(img, path)
                    entry = {
                        "name": img.name,
                        "key": "lightmap:%d" % index,
                        "format": extension,
                        "intensity": divisor,
                        "materials": [],
                        "path": path,
                    }
                    written[img.name] = entry
                except Exception as e:  # noqa: BLE001 — the model ships without it
                    reason = "its picture could not be written (%s)" % e
        if entry is None:
            skipped.append({"material": mat.name, "reason": reason})
            continue
        strength = 1.0
        if isinstance(authored, (int, float)) and not isinstance(authored, bool) and math.isfinite(authored) and authored > 0:
            strength = float(authored)
        mat[LIGHTMAP_KEY] = entry["key"]
        mat[LIGHTMAP_INTENSITY_KEY] = float(entry["intensity"]) * strength
        entry["materials"].append(mat.name)
    if written:
        report["lightmaps"] = list(written.values())
    if skipped:
        report["lightmapsSkipped"] = skipped


try:
    _carry_lightmaps()
except Exception as e:  # noqa: BLE001 — baked light is never worth the export
    report["warnings"].append(f"baked light could not be carried: {e}")
    for _m in bpy.data.materials:
        for _k in (LIGHTMAP_KEY, LIGHTMAP_INTENSITY_KEY):
            if _k in _m.keys():
                del _m[_k]

# VIEWPORT VISIBILITY SNAPSHOT (BEFORE stage 1 mutates hide flags for
# realization): the fidelity reference is the artist's Material-Preview
# VIEWPORT, which draws by visible_get() — collection/eye-icon state — while
# glTF export filters by hide_render only (use_renderable). Without this,
# meshes the artist never saw (viewport-hidden but render-visible) ship and
# the shell renders geometry Eevee never draws. Snapshot now; applied as
# hide_render before stage-3 export. hide_render=True helpers (boolean
# cutters) stay excluded.
_viewport_hidden = {
    o.name
    for o in scene.objects
    if not o.visible_get()
}

# KNOWN LIMIT, surfaced honestly: a source object INSIDE
# an instanced collection is outside the view layer, so visible_get() cannot
# govern it. If its own viewport flag hides it (hide_viewport), Eevee hides
# it in EVERY instance — but the exporter still ships it. Detect and WARN so
# the divergence is auditable instead of silent.
_scene_names = {o.name for o in scene.objects}
for _o in bpy.data.objects:
    if (
        _o.name not in _scene_names
        and _o.type == "MESH"
        and _o.hide_viewport
        and not _o.hide_render
    ):
        report["warnings"].append(
            f"'{_o.name}' (inside an instanced collection) is viewport-hidden "
            "but render-visible: Eevee hides it in every instance, the export "
            "still includes it. Set hide_render on it (or unhide) to align."
        )

# ---------------------------------------------------------------- stage 1 ---
# Realize generators. object.convert(target='MESH') evaluates the full
# modifier stack (geometry nodes included) and converts curves/etc. Objects
# that fail (linked libraries, zero-geometry evaluations) are skipped+reported.
CONVERTIBLE = {"CURVE", "SURFACE", "FONT", "META"}
view_layer_names = {o.name for o in bpy.context.view_layer.objects}
for obj in list(scene.objects):
    needs = obj.type in CONVERTIBLE or (obj.type == "MESH" and len(obj.modifiers) > 0)
    if not needs:
        continue
    if obj.name not in view_layer_names:
        # Excluded collection — Blender cannot select/convert it, and it is
        # not part of the authored view anyway. Report, don't fail.
        report["excludedObjects"].append(obj.name)
        continue
    # The name is taken BEFORE convert: on a metaball (and any type Blender
    # converts by making a new object) convert removes the original, and
    # touching it afterwards raises ReferenceError - which, raised inside the
    # except as well, would kill the whole export over one object.
    name = obj.name
    try:
        # convert needs the object selectable/visible and active.
        obj.hide_set(False)
        obj.hide_viewport = False
        bpy.ops.object.select_all(action="DESELECT")
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.convert(target="MESH")
        report["realizedObjects"].append(name)
    except Exception as e:  # noqa: BLE001 — per-object tolerance is the contract
        report["failedObjects"].append({"name": name, "error": str(e)})

# ---------------------------------------------------------------- stage 2 ---
# Bake materials the glTF exporter cannot map. The decision is
# EXPORTER-MAPPABILITY of the chain feeding the OUTPUT surface — not "is
# anything procedural": a material can hold an orphaned Principled while the
# real shading feeds the output another way, so a Principled-inputs-only
# probe sees nothing to do and the exporter emits flat white. Baking renders exactly what Cycles renders, so whatever
# the artist sees is what ships.


def find_principled(mat):
    if not mat.use_nodes:
        return None
    for n in mat.node_tree.nodes:
        if n.type == "BSDF_PRINCIPLED":
            return n
    return None


# Transparent/refractive shading the bake path MUST NOT touch: baking renders
# a material to an OPAQUE texture, so glass becomes a solid panel (a
# Light-Path/Transparent BSDF glass mix bakes into an opaque slab that shows
# nothing behind or reflected on it).
GLASSY_NODE_TYPES = {"BSDF_TRANSPARENT", "BSDF_GLASS", "BSDF_REFRACTION"}
# Emitted glazing: alpha low enough to see through AND to trip the shell's
# reflective-material rule, roughness low so the room probe reads as a
# reflection rather than a haze.
GLASS_ALPHA = 0.25
GLASS_ROUGHNESS = 0.05


def material_is_glassy(mat):
    """True when the surface chain carries real transparency/refraction."""
    for n in _surface_chain_nodes(mat):
        if n.type in GLASSY_NODE_TYPES:
            return True
        if n.type == "BSDF_PRINCIPLED":
            trans = n.inputs.get("Transmission Weight") or n.inputs.get("Transmission")
            if trans is not None and not trans.is_linked and trans.default_value > 0.1:
                return True
            alpha = n.inputs.get("Alpha")
            if alpha is not None and not alpha.is_linked and alpha.default_value < 0.95:
                return True
    return False


def resolve_reroute(node):
    seen = set()
    while node is not None and node.type == "REROUTE" and node.name not in seen:
        seen.add(node.name)
        inp = node.inputs[0]
        node = inp.links[0].from_node if inp.is_linked else None
    return node


def surface_source(mat):
    """The node actually feeding the active material output's Surface."""
    outs = [n for n in mat.node_tree.nodes if n.type == "OUTPUT_MATERIAL"]
    out = next((n for n in outs if getattr(n, "is_active_output", False)), outs[0] if outs else None)
    if out is None:
        return None
    s = out.inputs.get("Surface")
    if s is None or not s.is_linked:
        return None
    return resolve_reroute(s.links[0].from_node)


def mappable_tex(node):
    """A TEX_IMAGE the glTF exporter can carry: valid image, FLAT projection,
    vector unlinked or a plain UV map (box/generated/mapping chains export as
    NOTHING — they must bake)."""
    if node is None or node.type != "TEX_IMAGE" or node.image is None:
        return False
    if node.projection != "FLAT":
        return False
    vec = node.inputs.get("Vector")
    if vec is not None and vec.is_linked:
        src = resolve_reroute(vec.links[0].from_node)
        if src is None or src.type != "UVMAP":
            return False
    return True


def input_is_unmappable(socket):
    """A BSDF input the exporter cannot carry as-is."""
    if not socket.is_linked:
        return False
    node = resolve_reroute(socket.links[0].from_node)
    if node is None:
        return False
    if node.type == "TEX_IMAGE":
        return not mappable_tex(node)
    if node.type == "NORMAL_MAP":
        color = node.inputs.get("Color")
        if color is None or not color.is_linked:
            return False
        return not mappable_tex(resolve_reroute(color.links[0].from_node))
    return True


# The Principled inputs the glTF exporter can carry image/producer links on.
# ANY other linked input (Specular, Alpha, Sheen, Clearcoat, Transmission, …)
# is invisible to the exporter — 3ds-Max-imported materials often wire
# their (dead → magenta) maps into exactly those channels, so Blender renders
# magenta while the export comes out flat. Linked-anything-else ⇒ bake, and
# the bake reproduces what Cycles/Eevee actually show.
_GLTF_MAPPABLE_INPUTS = {"Base Color", "Roughness", "Metallic", "Normal", "Emission Color", "Emission", "Emission Strength"}


def material_needs_bake(mat):
    src = surface_source(mat)
    if src is None:
        # Nothing feeds the output — the material renders flat; flat exports
        # faithfully, no bake needed.
        return False
    if src.type != "BSDF_PRINCIPLED":
        # Mix/Diffuse/Emission/group trees — the glTF-invisible class.
        return True
    checks = ["Base Color", "Roughness", "Metallic", "Normal"]
    emission = src.inputs.get("Emission Color") or src.inputs.get("Emission")
    if any(input_is_unmappable(src.inputs[name]) for name in checks if name in src.inputs) or (
        emission is not None and input_is_unmappable(emission)
    ):
        return True
    # Any OTHER linked input drives shading the exporter cannot see.
    return any(
        inp.is_linked and inp.name not in _GLTF_MAPPABLE_INPUTS for inp in src.inputs
    )


def objects_using(mat):
    """Bakeable users: view-layer meshes with actual faces (an excluded or
    zero-face user cannot be selected/baked)."""
    out = []
    for o in scene.objects:
        if o.type != "MESH" or not any(s.material == mat for s in o.material_slots):
            continue
        if o.name not in view_layer_names:
            continue
        if len(o.data.polygons) == 0:
            continue
        out.append(o)
    return out


def ensure_uvs(obj):
    if obj.data.uv_layers:
        return
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.02)
    bpy.ops.object.mode_set(mode="OBJECT")


# Cycles bakes into the ACTIVE image node of EVERY material on EVERY selected
# object — a co-baking slot without one aborts the bake ("no active image"),
# and a previously-baked material would get its images OVERWRITTEN. A shared
# scratch image parked as the active node of every non-target material solves
# both (the classic multi-slot bake pitfall).
_scratch_img = None


def scratch_image():
    global _scratch_img
    if _scratch_img is None:
        _scratch_img = bpy.data.images.new("bake_scratch", 64, 64, alpha=False)
    return _scratch_img


def park_scratch_nodes(users, target_mat):
    touched = []
    for o in users:
        for slot in o.material_slots:
            m = slot.material
            if m is None or m is target_mat or not m.use_nodes:
                continue
            node = m.node_tree.nodes.new("ShaderNodeTexImage")
            node.image = scratch_image()
            m.node_tree.nodes.active = node
            node.select = True
            touched.append((m, node))
    return touched


def unpark_scratch_nodes(touched):
    for m, node in touched:
        try:
            m.node_tree.nodes.remove(node)
        except Exception:  # noqa: BLE001
            pass


def bake_material(mat, users):
    """Bake mat's channels using its user objects; rewire to baked images."""
    nt = mat.node_tree
    # The BSDF that actually shades (surface chain first; any Principled as a
    # constants fallback for orphaned-Principled trees).
    src = surface_source(mat)
    bsdf = src if (src is not None and src.type == "BSDF_PRINCIPLED") else find_principled(mat)

    for o in users:
        ensure_uvs(o)

    # Select the users; Cycles bakes the active image node of each material.
    bpy.ops.object.select_all(action="DESELECT")
    for o in users:
        o.hide_render = False
        o.select_set(True)
    bpy.context.view_layer.objects.active = users[0]

    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = BAKE_SAMPLES
    scene.render.bake.use_selected_to_active = False
    scene.render.bake.margin = 4

    baked = {}

    def bake_pass(pass_name, bake_type, colorspace, extra=None):
        img = bpy.data.images.new(f"bake_{mat.name}_{pass_name}", BAKE_RES, BAKE_RES, alpha=False)
        img.colorspace_settings.name = colorspace
        node = nt.nodes.new("ShaderNodeTexImage")
        node.image = img
        nt.nodes.active = node
        node.select = True
        kwargs = {"type": bake_type, "margin": 4}
        if bake_type == "DIFFUSE":
            # Color only — no lighting in the albedo.
            kwargs["pass_filter"] = {"COLOR"}
        bpy.ops.object.bake(**kwargs)
        img.pack()
        baked[pass_name] = (img, node)

    emission_input = None
    if bsdf is not None:
        emission_input = bsdf.inputs.get("Emission Color") or bsdf.inputs.get("Emission")

    # Bake every LINKED channel: the rewire below tears the original tree
    # down, so even an exporter-mappable side-channel (a plain roughness map
    # next to an unmappable base color) must be baked or it would be lost.
    parked = park_scratch_nodes(users, mat)
    try:
        bake_pass("diffuse", "DIFFUSE", "sRGB")
        if bsdf is not None and bsdf.inputs["Roughness"].is_linked:
            bake_pass("roughness", "ROUGHNESS", "Non-Color")
        if bsdf is not None and "Normal" in bsdf.inputs and bsdf.inputs["Normal"].is_linked:
            bake_pass("normal", "NORMAL", "Non-Color")
        if emission_input is not None and emission_input.is_linked:
            bake_pass("emit", "EMIT", "sRGB")
    finally:
        unpark_scratch_nodes(parked)

    # Capture unlinked constants BEFORE tearing the old tree down.
    constants = {}
    if bsdf is not None:
        for name in ("Metallic", "Roughness", "IOR", "Alpha"):
            s = bsdf.inputs.get(name)
            if s is not None and not s.is_linked:
                constants[name] = s.default_value

    # Rewire: fresh Principled fed by the baked images; constants carried over.
    baked_nodes = {entry[1] for entry in baked.values()}
    for n in list(nt.nodes):
        if n.type == "OUTPUT_MATERIAL" or n in baked_nodes:
            continue
        nt.nodes.remove(n)
    out_node = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    new_bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    for name, val in constants.items():
        if name in new_bsdf.inputs:
            new_bsdf.inputs[name].default_value = val
    nt.links.new(new_bsdf.outputs["BSDF"], out_node.inputs["Surface"])
    nt.links.new(baked["diffuse"][1].outputs["Color"], new_bsdf.inputs["Base Color"])
    if "roughness" in baked:
        nt.links.new(baked["roughness"][1].outputs["Color"], new_bsdf.inputs["Roughness"])
    if "normal" in baked:
        nm = nt.nodes.new("ShaderNodeNormalMap")
        nt.links.new(baked["normal"][1].outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], new_bsdf.inputs["Normal"])
    if "emit" in baked:
        target = new_bsdf.inputs.get("Emission Color") or new_bsdf.inputs.get("Emission")
        if target is not None:
            nt.links.new(baked["emit"][1].outputs["Color"], target)
            strength = new_bsdf.inputs.get("Emission Strength")
            if strength is not None:
                strength.default_value = 1.0

    # Post-rewire verification: the surface output must be the new Principled
    # with the baked diffuse actually linked (the report carries the proof).
    base = new_bsdf.inputs["Base Color"]
    linked = bool(
        base.is_linked
        and base.links[0].from_node.type == "TEX_IMAGE"
        and base.links[0].from_node.image is not None
    )
    return list(baked.keys()), linked


# ------------------------------------------------------------ glazing ---
# Which glass is architectural glazing is decided HERE, where the whole scene
# is visible, and written into the glb so the client never guesses from
# shape at load (docs/design/glazing-at-export.md). Per object, by geometry,
# never by name: the world-space extents of the faces that use the material
# on that object (a window's glass, not the window with its frame), sorted a<=b<=c;
# a SHEET is a < SHEET_RATIO * b; a sheet whose thin axis is horizontal is a
# PANE (a window), one whose thin axis is vertical (Blender Z) is a SLAB (a
# table top); anything else is a SOLID (a bottle, a lamp shade). Only panes
# are glazing. A glassy material shared between panes and anything else is
# split: a copy named <name>__glazing is marked and assigned on the pane
# objects, the original stays on the rest. Each decision goes in the report.
GLAZING_KEY = "veml_glazing"
SHEET_RATIO = 0.12


def _world_extents(obj, mat=None):
    """World-space extents of the faces that use \`mat\` on \`obj\` (a window
    object carries its frame and its glass in one mesh: the glass faces are
    the sheet, the whole object is not). Without \`mat\`, or when no face uses
    it, the object's bounding box."""
    import mathutils
    if mat is not None:
        slots = {i for i, s in enumerate(obj.material_slots) if s.material == mat}
        if slots:
            try:
                dg = bpy.context.evaluated_depsgraph_get()
                ev = obj.evaluated_get(dg)
                me = ev.to_mesh()
                try:
                    verts = me.vertices
                    lo = [float("inf")] * 3
                    hi = [float("-inf")] * 3
                    seen = False
                    for poly in me.polygons:
                        if poly.material_index not in slots:
                            continue
                        for vi in poly.vertices:
                            w = obj.matrix_world @ verts[vi].co
                            seen = True
                            for i in range(3):
                                lo[i] = min(lo[i], w[i])
                                hi[i] = max(hi[i], w[i])
                    if seen:
                        return [hi[i] - lo[i] for i in range(3)]
                finally:
                    ev.to_mesh_clear()
            except Exception:
                pass
    corners = [obj.matrix_world @ mathutils.Vector(c) for c in obj.bound_box]
    lo = [min(c[i] for c in corners) for i in range(3)]
    hi = [max(c[i] for c in corners) for i in range(3)]
    return [hi[i] - lo[i] for i in range(3)]


def glazing_role(extents):
    """'pane' | 'slab' | 'solid' from world-space extents (x, y, z; Blender Z-up)."""
    order = sorted(range(3), key=lambda i: extents[i])
    a, b = extents[order[0]], extents[order[1]]
    if b <= 0 or a >= SHEET_RATIO * b:
        return "solid"
    return "slab" if order[0] == 2 else "pane"


def _glass_users(mat):
    out = []
    for o in scene.objects:
        if o.type != "MESH" or o.name not in view_layer_names or o.hide_render:
            continue
        if any(s.material == mat for s in o.material_slots):
            out.append(o)
    return out


_glazing_report = {"marked": [], "panes": [], "splits": [], "unmarked": []}
_glazing_marked = set()
for _mat in list(bpy.data.materials):
    if _mat.users == 0 or not _mat.use_nodes or not material_is_glassy(_mat):
        continue
    _users = _glass_users(_mat)
    _roles = []
    for _o in _users:
        _ext = _world_extents(_o, _mat)
        _roles.append({"object": _o.name, "role": glazing_role(_ext), "extents": [round(v, 4) for v in _ext]})
    _panes = [r for r in _roles if r["role"] == "pane"]
    _others = [r for r in _roles if r["role"] != "pane"]
    if not _panes:
        _why = "no users" if not _roles else (
            "no window-shaped user: " + ", ".join(f"{r['object']} is a {r['role']}" for r in _roles))
        _glazing_report["unmarked"].append({"material": _mat.name, "reason": _why, "objects": _roles})
        continue
    if not _others:
        _mat[GLAZING_KEY] = 1
        _glazing_marked.add(_mat.name)
        _glazing_report["marked"].append(_mat.name)
        _glazing_report["panes"].extend({**r, "material": _mat.name} for r in _panes)
        continue
    _copy = _mat.copy()
    _copy.name = _mat.name + "__glazing"
    _copy[GLAZING_KEY] = 1
    _pane_names = {r["object"] for r in _panes}
    for _o in _users:
        if _o.name not in _pane_names:
            continue
        for _slot in _o.material_slots:
            if _slot.material == _mat:
                _slot.material = _copy
    _glazing_marked.add(_copy.name)
    _glazing_report["marked"].append(_copy.name)
    _glazing_report["panes"].extend({**r, "material": _copy.name} for r in _panes)
    _glazing_report["splits"].append(
        {"material": _mat.name, "markedAs": _copy.name, "panes": _panes, "others": _others}
    )
report["glazing"] = _glazing_report

for mat in list(bpy.data.materials):
    if mat.users == 0 or not mat.use_nodes:
        continue
    try:
        # Glazing FIRST: a transparent/refractive material must never bake
        # (the bake is opaque by construction — glass would become a solid
        # panel). Rewire to a plain transparent Principled the
        # glTF exporter maps to alphaMode BLEND, so the shell sees through it
        # and its reflective-material rule attaches the room probe.
        if material_is_glassy(mat):
            nt = mat.node_tree
            for n in list(nt.nodes):
                if n.type != "OUTPUT_MATERIAL":
                    nt.nodes.remove(n)
            out_node = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
            glass = nt.nodes.new("ShaderNodeBsdfPrincipled")
            glass.inputs["Base Color"].default_value = (0.92, 0.96, 1.0, 1.0)
            if glass.inputs.get("Alpha") is not None:
                glass.inputs["Alpha"].default_value = GLASS_ALPHA
            if glass.inputs.get("Roughness") is not None:
                glass.inputs["Roughness"].default_value = GLASS_ROUGHNESS
            if glass.inputs.get("Metallic") is not None:
                glass.inputs["Metallic"].default_value = 0.0
            nt.links.new(glass.outputs["BSDF"], out_node.inputs["Surface"])
            # BLEND (not the authored HASHED) so glTF carries alphaMode BLEND.
            try:
                mat.blend_method = "BLEND"
            except (AttributeError, TypeError):
                pass
            report.setdefault("glassMaterials", []).append(mat.name)
            continue
        if not material_needs_bake(mat):
            continue
        users = objects_using(mat)
        if not users:
            report["skippedMaterials"].append(
                {"name": mat.name, "reason": "no bakeable users (excluded or faceless)"}
            )
            continue
        passes, linked = bake_material(mat, users)
        report["bakedMaterials"].append(
            {"name": mat.name, "passes": passes, "linked": linked, "users": [o.name for o in users]}
        )
    except Exception as e:  # noqa: BLE001 — tolerance contract
        report["bakeFailures"].append({"name": mat.name, "error": str(e)})

# ---------------------------------------------------------------- stage 4 ---
# Camera pose → VEML space BEFORE export (matrices unaffected by export).
# Empirically derived against the shell (glTF Y-up export + Babylon's RH→LH
# root): shell/VEML (x, y, z) = blender (−x, z, −y). The naive (x, z, −y)
# mapping mirrors X and yaw, putting a pose on the wrong side of the room.
# The veml_spawn spawn-camera custom property: a camera carrying a
# truthy \`veml_spawn\` beats the ACTIVE scene camera as the entry point.
# Structural authoring data, not a name convention — a Blender plugin can one
# day set it with a checkbox, and the name is format-scoped (veml_spawn).
# Multiple carriers: first by object name (deterministic) + a warning.
spawn_cams = sorted(
    (o for o in scene.objects if o.type == "CAMERA" and bool(o.get("veml_spawn"))),
    key=lambda o: o.name,
)
if len(spawn_cams) > 1:
    report["warnings"].append(
        "multiple cameras carry the veml_spawn custom property (%s); using \\"%s\\" (first by object name)"
        % (", ".join(o.name for o in spawn_cams), spawn_cams[0].name)
    )
cam = spawn_cams[0] if spawn_cams else scene.camera
if cam is not None:
    m = cam.matrix_world
    eye = m.translation
    # Camera forward is local -Z.
    fwd = m.to_quaternion() @ __import__("mathutils").Vector((0, 0, -1))
    fx, fz = -fwd.x, -fwd.y  # forward in shell (x, z) plane
    yaw = math.atan2(fx, fz)
    report["camera"] = {
        "feet": {"x": -eye.x, "y": eye.z - EYE_HEIGHT_M, "z": -eye.y},
        "rotation": {"x": 0.0, "y": math.sin(yaw / 2), "z": 0.0, "w": math.cos(yaw / 2)},
        "source": "veml_spawn" if spawn_cams else "active",
        "name": cam.name,
    }

report["lightCount"] = sum(1 for o in scene.objects if o.type == "LIGHT")

# World settings: the raw \`veml_world\` scene dict the add-on's World
# panel writes (Blender-VEML/properties/world_settings.py), passed through as
# authored. The ingest validates it; this stage only reads it.
_world_settings = scene.get("veml_world")
if _world_settings is not None:
    report["worldSettings"] = (
        _world_settings.to_dict() if hasattr(_world_settings, "to_dict") else dict(_world_settings)
    )


# --------------------------------------------------------------- stage 4b ---
# World background carry: glTF never exports the Blender World, so the sky/
# environment the artist sees behind the scene vanishes. Two cases:
#   - an Environment Texture (equirect image) world → saved beside the glb;
#     the ingest emits it as the VEML \`<background panorama=…>\`;
#   - a plain background color world → carried as the VEML background color
#     (linear → sRGB) instead of the CLI's sky-blue default.
def _linear_to_srgb(c):
    c = max(0.0, min(1.0, c))
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055


def _lookdev_hdri():
    """The Material-Preview (lookdev) HDRI the artist was authoring against.

    Blender's Material Preview lights the viewport with a STUDIO LIGHT
    (default forest.exr) that is NEVER saved into the .blend — so glass and
    metal reflect an outdoor environment that does not exist anywhere in the
    file, and a faithful conversion of the file alone can never reproduce it.
    The SETTING is saved (screen → 3D-viewport space → shading), so resolve
    the studio light to a real image path and ship what the artist saw.
    Returns (name, path) or (None, None). \`use_scene_world\` means the artist
    deliberately chose the scene's own world — respected, never overridden.
    """
    active_screen = getattr(getattr(bpy.context, "window", None), "screen", None)

    def _screen_lookdev(screen):
        found = None
        for area in screen.areas:
            if area.type != "VIEW_3D":
                continue
            for space in area.spaces:
                shading = getattr(space, "shading", None)
                if shading is None or getattr(shading, "type", None) != "MATERIAL":
                    continue
                if getattr(shading, "use_scene_world", False):
                    continue
                if getattr(shading, "studio_light", None):
                    # WORLD OPACITY (studiolight_background_alpha): 0 means
                    # the HDRI lights and REFLECTS but is never DRAWN — the
                    # artist sees a plain backdrop with environment
                    # reflections.
                    drawn_here = (
                        float(getattr(shading, "studiolight_background_alpha", 0.0) or 0.0) > 0.0
                    )
                    found = (shading.studio_light, drawn_here)
        return found

    # The ACTIVE workspace is the artist's working view and DECIDES the
    # drawn/undrawn question; other workspaces (e.g. an untouched Shading
    # tab at opacity 1.0) are only a fallback for the HDRI name.
    name = None
    drawn = False
    active = _screen_lookdev(active_screen) if active_screen is not None else None
    if active is not None:
        name, drawn = active
    else:
        # No Material Preview viewport on the active workspace: fall back to
        # scanning all screens, CONSERVATIVELY — if ANY viewport has World
        # Opacity 0, treat the HDRI as undrawn (environment-only). Shipping a
        # visible sky the artist may never have seen is the worse error; the
        # opposite direction is one \`studiolight_background_alpha\` away.
        drawn_votes = []
        for screen in bpy.data.screens:
            found = _screen_lookdev(screen)
            if found is not None:
                name = found[0]
                drawn_votes.append(found[1])
        drawn = bool(drawn_votes) and all(drawn_votes)
    if not name:
        return None, None, False
    try:
        for sl in bpy.context.preferences.studio_lights:
            if sl.name == name and sl.type == "WORLD" and sl.path:
                return name, sl.path, drawn
    except Exception:  # noqa: BLE001 — preferences unavailable is not fatal
        pass
    return name, None, drawn


def _srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _mean_luminance(image, raw=False, linear=False):
    """Sampled mean Rec.709 luminance of an image datablock. \`raw=True\` reads
    the file's stored values (display-space for a PNG) by suspending color
    management on the datablock; \`linear=True\` then decodes them from sRGB,
    which is what a client does before it lights anything."""
    prev = None
    if raw:
        prev = image.colorspace_settings.name
        image.colorspace_settings.name = "Non-Color"
    try:
        px = image.pixels[:]
        n = len(px) // 4
        if n == 0:
            return None
        stride = max(1, n // 200000)
        total = 0.0
        cnt = 0
        for i in range(0, n, stride):
            j = i * 4
            r, g, b = px[j], px[j + 1], px[j + 2]
            if linear:
                r, g, b = _srgb_to_linear(r), _srgb_to_linear(g), _srgb_to_linear(b)
            total += 0.2126 * r + 0.7152 * g + 0.0722 * b
            cnt += 1
        return total / cnt
    finally:
        if prev is not None:
            image.colorspace_settings.name = prev


# The exposure model (docs/design/exposure-and-tone.md). An HDRI's radiance
# runs far past 1.0; a PNG stops at 1.0. Baking it with the Standard view
# as it is clips the bright sky to white and keeps the dim ground, so a
# single multiplier on the client can restore the average but not the
# balance: the parts that clipped stay, the parts that did not get the whole
# boost, and lit surfaces come out warm. The bake therefore DIVIDES the
# image by an exposure E first, chosen so that only the brightest sliver
# clips (the sun), and declares E; the client multiplies back by E, which
# is exact wherever nothing clipped. E is the luminance under which
# EXPOSURE_KEEP of the pixels fall, never below 1 (an image that fits needs
# no division).
EXPOSURE_KEEP = 0.995


def _luminance_percentile(image, q):
    """Luminance below which the fraction q of sampled pixels fall (linear)."""
    px = image.pixels[:]
    n = len(px) // 4
    if n == 0:
        return None
    stride = max(1, n // 200000)
    lum = [0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2] for i in range(0, n, stride)]
    lum.sort()
    return lum[min(len(lum) - 1, int(q * len(lum)))]


def _save_equirect_png(image, out_path):
    """Write an image datablock out as PNG with the Standard view transform,
    divided by the exposure the model chooses (see EXPOSURE_KEEP).

    Returns the path and the exposure E the client must multiply back by,
    measured rather than assumed: mean HDR luminance over the mean LINEAR
    luminance of the saved PNG (decoded from sRGB). With nothing clipped that
    is E to within rounding; what clipped shows as the difference, and the
    report carries both so a reader can see how much the sun cost.
    """
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "Standard"
    prev_exposure = scene.view_settings.exposure
    exposure = 1.0
    try:
        p = _luminance_percentile(image, EXPOSURE_KEEP)
        if p is not None and p > 1.0:
            exposure = p
    except Exception as e:  # noqa: BLE001 — the measurement is best-effort
        report["warnings"].append(f"exposure measurement failed: {e}")
    scene.view_settings.exposure = -math.log2(exposure)
    try:
        image.save_render(out_path)
    finally:
        scene.view_settings.exposure = prev_exposure
    ratio = None
    try:
        hdr_mean = _mean_luminance(image)
        ldr_img = bpy.data.images.load(out_path)
        try:
            ldr_mean = _mean_luminance(ldr_img, raw=True, linear=True)
        finally:
            bpy.data.images.remove(ldr_img)
        if hdr_mean and ldr_mean:
            ratio = hdr_mean / ldr_mean
    except Exception as e:  # noqa: BLE001 — measurement is best-effort
        report["warnings"].append(f"exposure-ratio measurement failed: {e}")
    report.setdefault("exposure", {})[os.path.basename(out_path)] = {
        "exposure": exposure,
        "measuredRatio": ratio,
        "keep": EXPOSURE_KEEP,
    }
    return out_path, ratio, exposure


def _lookdev_background():
    """Carry the Material-Preview HDRI as the world's panorama background.

    This is the Blender path ONLY, by construction: a viewport setting has no
    meaning for a .glb/.dae/.fbx input, so nothing outside this exporter ever
    inherits it. \`--no-lookdev-sky\` opts out (or set a real World in Blender).
    """
    if NO_LOOKDEV_SKY:
        return None
    name, path, drawn = _lookdev_hdri()
    if not path or not os.path.exists(path):
        if name:
            report["warnings"].append(f"lookdev HDRI '{name}' could not be resolved to a file")
        return None
    try:
        sky_path = OUT_GLB + ".sky.png"
        _, exposure_ratio, exposure = _save_equirect_png(bpy.data.images.load(path), sky_path)
        base = {"path": sky_path, "source": "lookdev", "name": name, "exposure": exposure}
        if exposure_ratio is not None:
            base["exposureRatio"] = exposure_ratio
        if drawn:
            return {"kind": "panorama", **base}
        # WORLD OPACITY 0: the HDRI lights and REFLECTS but is never
        # DRAWN — the artist sees a plain backdrop. Ship it as an IBL-only
        # ENVIRONMENT (the environment profile), never as a visible sky.
        return {"kind": "environment", **base}
    except Exception as e:  # noqa: BLE001 — degrade to the world color, report
        report["warnings"].append(f"lookdev HDRI '{name}' could not be saved: {e}")
        return None


def _world_background():
    w = scene.world
    if w is None:
        return _lookdev_background()
    if w.use_nodes:
        env = next(
            (n for n in w.node_tree.nodes if n.type == "TEX_ENVIRONMENT" and n.image is not None),
            None,
        )
        if env is not None and (env.image.packed_file or os.path.exists(bpy.path.abspath(env.image.filepath))):
            try:
                src = bpy.path.abspath(env.image.filepath) if env.image.filepath else ""
                ext = os.path.splitext(src)[1].lower()
                if src and os.path.exists(src) and ext in (".png", ".jpg", ".jpeg") and not env.image.packed_file:
                    # Web-ready file on disk — copy the bytes untouched.
                    sky_path = OUT_GLB + ".sky" + ext
                    import shutil

                    shutil.copyfile(src, sky_path)
                else:
                    # Packed, or a format the shell can't texture (HDR/EXR/TGA)
                    # — write the pixel data out as PNG.
                    sky_path = OUT_GLB + ".sky.png"
                    scene.render.image_settings.file_format = "PNG"
                    env.image.save_render(sky_path)
                return {"kind": "panorama", "path": sky_path}
            except Exception as e:  # noqa: BLE001 — degrade to color, report
                report.setdefault("warnings", []).append(f"world env texture save failed: {e}")
        # No environment texture on the scene's World: what the artist was
        # ACTUALLY looking at is the Material-Preview studio light, so carry
        # that before falling back to the flat world color.
        lookdev = _lookdev_background()
        if lookdev is not None:
            return lookdev
        bg = next((n for n in w.node_tree.nodes if n.type == "BACKGROUND"), None)
        if bg is not None:
            r, g, b = (bg.inputs["Color"].default_value[i] for i in range(3))
            strength = bg.inputs["Strength"].default_value
            r, g, b = (min(1.0, v * strength) for v in (r, g, b))
            hexed = "#%02x%02x%02xff" % tuple(round(_linear_to_srgb(v) * 255) for v in (r, g, b))
            return {"kind": "color", "color": hexed}
    return _lookdev_background()


report["worldBackground"] = _world_background()

# Apply the viewport-visibility snapshot: what the artist's viewport
# hides, the export excludes — use_renderable below then drops them.
for _name in sorted(_viewport_hidden):
    _o = scene.objects.get(_name)
    if _o is not None and not _o.hide_render:
        _o.hide_render = True
        report["viewportHiddenObjects"].append(_name)

# UNASSIGNED MATERIAL SLOTS: a mesh with no material exports
# with none, and the glTF SPEC default every viewer then applies is
# metallic 1 / roughness 1 — dark environment-tinted metal. Blender renders
# an unassigned slot as its DEFAULT SURFACE: diffuse 0.8 gray, metallic 0,
# roughness 0.5 (which is why unmaterialed meshes look white in Eevee).
# Assign that surface EXPLICITLY so every
# viewer — not just ones carrying a compensating remap — renders what the
# authoring tool shows.
_default_mat = None


def _blender_default_material():
    global _default_mat
    if _default_mat is None:
        _default_mat = bpy.data.materials.new("BlenderDefaultSurface")
        _default_mat.use_nodes = True
        _p = find_principled(_default_mat)
        if _p is not None:
            _p.inputs["Base Color"].default_value = (0.8, 0.8, 0.8, 1.0)
            _p.inputs["Metallic"].default_value = 0.0
            _p.inputs["Roughness"].default_value = 0.5
    return _default_mat


for _o in bpy.data.objects:
    if _o.type != "MESH" or _o.hide_render:
        continue
    _slots = list(_o.material_slots)
    _touched = False
    if not _slots:
        _o.data.materials.append(_blender_default_material())
        _touched = True
    else:
        for _slot in _slots:
            if _slot.material is None:
                _slot.material = _blender_default_material()
                _touched = True
    if _touched:
        report["defaultMaterialAssigned"].append(_o.name)

# Portals from marked objects: a render-visible mesh carrying
# a non-empty \`veml_link_href\` (the add-on's Portal box, or set by hand)
# leaves the model glb and is exported ALONE below, world transform kept, so
# the ingest can emit it as an asset of its own carrying the link. Sorted by
# name: the emitted order (and tags) are deterministic.
_view_layer_names = {o.name for o in bpy.context.view_layer.objects}
_portal_objects = sorted(
    (
        o
        for o in scene.objects
        if o.type == "MESH"
        and not o.hide_render
        and o.name in _view_layer_names
        and str(o.get("veml_link_href", "")).strip()
    ),
    key=lambda o: o.name,
)
# --- portal link rule (begin) ---
# Only http(s) URLs and paths may become a portal: a visitor activating one
# must only ever navigate. A browser removes tabs and newlines anywhere in a
# URL, and control characters at its ends, before it reads the scheme, so a
# value holding any control character is refused outright rather than
# guessed at. This block is identical in the Blender add-on
# (Blender-VEML/properties/portal_link.py) and the ingest exporter
# (src/blend/blend_export.py); a test compares the two.
import re as _portal_re

_PORTAL_SCHEME = _portal_re.compile(r"^([a-zA-Z][a-zA-Z0-9+.-]*):")


def valid_href(value):
    value = str(value)
    if any(ord(ch) < 0x20 or ord(ch) == 0x7F for ch in value):
        return False
    m = _PORTAL_SCHEME.match(value.strip(" "))
    return m is None or m.group(1).lower() in ("http", "https")
# --- portal link rule (end) ---


# A property set by hand gets no other check than this one. An unsafe link
# makes no portal: the object stays scenery.
for _o in list(_portal_objects):
    _href = str(_o["veml_link_href"])
    if not valid_href(_href):
        report["warnings"].append(
            f"'{_o.name}' has an unsafe link ({_href!r}); only http(s) and paths make a portal, so it stays ordinary scenery"
        )
        _portal_objects.remove(_o)
for _o in _portal_objects:
    _o.hide_render = True  # out of the model glb (use_renderable below)

# ---------------------------------------------------------------- stage 3 ---
# Custom properties become glTF extras (export_extras below), which is how
# the world's own marks travel: veml_glazing on a pane's material. A .blend
# also carries what a modeller left on things: file paths, reminders,
# project codes, on materials, objects, meshes, lights and the scene. A
# published world is public and its files are hash-addressed, so none of
# that may leave with it. Every custom property that is not the world's
# (named veml_*) goes, from everything the exporter can write extras for:
# Blender's exporter reads them off objects, meshes, materials, lights,
# cameras, collections, actions, the scene and each bone.
# The file on disk is never saved from here, so nothing is lost to the
# author; the marks the exporter reads later (veml_link_href on a portal)
# are veml_* and stay.
VEML_PREFIX = "veml_"


def _strip_foreign_extras():
    pools = (
        bpy.data.scenes, bpy.data.collections, bpy.data.objects, bpy.data.meshes,
        bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.curves,
        bpy.data.armatures, bpy.data.actions,
    )
    # A bone's properties are written on its joint node; they live on the
    # bone, not on the armature block that holds it.
    bones = (bone for arm in bpy.data.armatures for bone in arm.bones)
    dropped = 0
    for holder in (block for pool in pools for block in pool), bones:
        for block in holder:
            for key in list(block.keys()):
                if key.startswith(VEML_PREFIX) or key.startswith("_"):
                    continue
                try:
                    del block[key]
                    dropped += 1
                except (KeyError, TypeError, AttributeError):
                    pass  # a library-linked block, or an RNA-defined key: not an extra of ours to drop
    return dropped


_dropped_extras = _strip_foreign_extras()
if _dropped_extras:
    report["extrasDropped"] = _dropped_extras

bpy.ops.export_scene.gltf(
    filepath=OUT_GLB,
    export_format="GLB",
    export_apply=True,
    # Only RENDER-VISIBLE objects: hide_render helpers (boolean cutters — a
    # window-cutter would otherwise plug the very hole it cuts) are authored
    # as invisible; Eevee never draws them.
    use_renderable=True,
    export_lights=True,      # KHR_lights_punctual (the lighting profile)
    export_cameras=False,    # the entry point carries the view
    export_tangents=False,   # tangent export aborts on ngons — never re-enable
    export_yup=True,
    # Custom properties ride as glTF extras: the glazing mark on a pane's
    # material (veml_glazing) is how the world says which glass is a window.
    # Only veml_* properties are left by now (_strip_foreign_extras above).
    export_extras=True,
    # The scene's timeline as ONE animation, what Play shows in Blender;
    # the shell loops a glb's first animation on load. A still scene exports none.
    export_animations=True,
    export_animation_mode="SCENE",
    export_image_format=IMAGE_FORMAT,
)

# Each marked object on its own, at its world place and size.
# A failure is a warning, never a failed export: the rest of the world ships.
if _portal_objects:
    report["portals"] = []
for _i, _o in enumerate(_portal_objects):
    _path = os.path.join(os.path.dirname(OUT_GLB), "portal-%d.glb" % _i)
    try:
        _o.hide_render = False
        _o.hide_set(False)
        bpy.ops.object.select_all(action="DESELECT")
        _o.select_set(True)
        bpy.context.view_layer.objects.active = _o
        bpy.ops.export_scene.gltf(
            filepath=_path,
            export_format="GLB",
            use_selection=True,
            export_apply=True,
            export_lights=False,
            export_cameras=False,
            export_tangents=False,   # aborts on ngons, as above
            export_yup=True,
            export_extras=False,
            export_animations=True,   # an animated door keeps moving
            export_animation_mode="SCENE",
        )
        _entry = {"name": _o.name, "href": str(_o["veml_link_href"]).strip(), "path": _path}
        _label = str(_o.get("veml_link_label", "")).strip()
        if _label:
            _entry["label"] = _label
        report["portals"].append(_entry)
    except Exception as e:  # noqa: BLE001 — per-object tolerance is the contract
        report["warnings"].append(f"portal '{_o.name}' could not be exported on its own, and is left out of the world: {e}")

# Speakers. glTF export ignores Speaker objects, so each unmuted one
# is reported here with its place (glTF space: Blender (x, y, z) -> (x, z, -y),
# the Y-up export's own mapping) and settings, and its sound converted to MP3
# (the KHR_audio_emitter draft's one format) with Blender's own \`aud\`. The
# ingest adds the emitter nodes to the glb and writes the MP3 beside it. A
# missing or unreadable sound is a warning: the world ships without it.
_speakers = sorted(
    (
        o
        for o in scene.objects
        if o.type == "SPEAKER" and not o.hide_render and o.name in _view_layer_names and not o.data.muted
    ),
    key=lambda o: o.name,
)
if _speakers:
    import aud
    import mathutils

    report["speakers"] = []
for _i, _o in enumerate(_speakers):
    _spk = _o.data
    _snd = _spk.sound
    try:
        if _snd is None:
            raise RuntimeError("it has no sound")
        _src = os.path.join(os.path.dirname(OUT_GLB), "speaker-src-%d" % _i)
        if _snd.packed_file is not None:
            with open(_src, "wb") as _f:
                _f.write(_snd.packed_file.data)
        else:
            _src = bpy.path.abspath(_snd.filepath)
            if not os.path.isfile(_src):
                raise RuntimeError(f"its sound file was not found: {os.path.basename(_src)}")
        _mp3 = os.path.join(os.path.dirname(OUT_GLB), "speaker-%d.mp3" % _i)
        # Mono: a positional sound is placed by the shell, not by its channels.
        aud.Sound(_src).write(_mp3, 44100, aud.CHANNELS_MONO, aud.FORMAT_S16, aud.CONTAINER_MP3, aud.CODEC_MP3, 128000, 16384)
        if not os.path.isfile(_mp3) or os.path.getsize(_mp3) == 0:
            raise RuntimeError("its sound could not be converted to MP3")
        _t = _o.matrix_world.translation
        _entry = {
            "name": _o.name,
            "position": [_t.x, _t.z, -_t.y],
            # Blender stores these as 32-bit floats (0.8 reads 0.800000011...):
            # six decimals keep what the artist typed.
            "gain": round(_spk.volume, 6),
            "refDistance": round(_spk.distance_reference, 6),
            "maxDistance": round(_spk.distance_max, 6),
            "rolloffFactor": round(_spk.attenuation, 6),
            "path": _mp3,
        }
        # A cone (either angle under 360). Blender's cone faces the speaker's
        # local -Z, and so does a KHR_audio_emitter cone on its node. The node
        # gets the turn glTF export gives cameras and lights (-90 degrees
        # about X) so that its -Z is the speaker's -Z, then the Y-up swizzle:
        # Blender (w, x, y, z) -> glTF [x, z, -y, w]. Both sides use full
        # angles: Blender in degrees, the draft in radians.
        if _spk.cone_angle_inner < 360 or _spk.cone_angle_outer < 360:
            _q = _o.matrix_world.to_quaternion() @ mathutils.Quaternion((math.sqrt(0.5), -math.sqrt(0.5), 0.0, 0.0))
            _q.normalize()
            _entry["rotation"] = [_q.x, _q.z, -_q.y, _q.w]
            _entry["cone"] = {
                "innerAngle": round(math.radians(_spk.cone_angle_inner), 6),
                "outerAngle": round(math.radians(_spk.cone_angle_outer), 6),
                "outerGain": round(_spk.cone_volume_outer, 6),
            }
        report["speakers"].append(_entry)
    except Exception as e:  # noqa: BLE001 — per-object tolerance is the contract
        report["warnings"].append(f"speaker '{_o.name}' makes no sound in the world: {e}")

with open(OUT_REPORT, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2)
print("BLEND_EXPORT_OK", OUT_GLB)
`,g=`/out/scene.glb`,_=`/out/report.json`;function v(e){let t=e[g];if(!t)throw Error(`Blender wrote no glb: the export did not finish. Its output is in the report above.`);let n=e[_],r=n?JSON.parse(new TextDecoder().decode(n)):{},i=t=>t?e[t]:void 0,a=(r.portals??[]).map(e=>i(e.path)).filter(e=>e!==void 0),o=(r.speakers??[]).map(e=>i(e.path)).filter(e=>e!==void 0),s=(r.lightmaps??[]).map(e=>i(e.path)??new Uint8Array),c=r.worldBackground;return{glb:t,report:r,portals:a,speakers:o,lightmaps:s,sky:c&&(c.kind===`panorama`||c.kind===`environment`)?i(c.path):void 0}}var y=`blender-runtime/`,b=`${y}loader/browser/index.js`,x=512,S=2,C=`Blender in the browser is not enabled on this WebVerse. Convert the .blend with Blender's add-on (Save and Publish) or with veml-ingest on a computer with Blender.`,w=e=>!!e.crossOriginIsolated,T=e=>({label:`Close`,run:()=>u(e,`closed`)});async function E(e){try{return(await fetch(new URL(`${y}manifest.json`,e.baseURI).href,{cache:`no-store`})).ok}catch{return!1}}async function D(e,t,r,i){let a=e.defaultView;if(!await E(e)){u(e,`failed`,`Cannot open ${t.name} here`,[C],[T(e)]);return}if(w(a)){await j(e,t,r,i,null);return}u(e,`converting`,`Opening ${t.name}`,[`Blender runs here, in your browser. The page reloads once to make room for it, and once more when it is done; nothing is uploaded.`]);try{let e=await o(a);await n(e.store,e.scopeUrl,t,r)}catch(n){u(e,`failed`,`Could not open ${t.name}`,[n instanceof Error?n.message:String(n)],[T(e)]);return}a.location.replace(p(a.location.href))}async function O(e,n){let r=e.defaultView,i=await o(r),a=await t(i.store,i.scopeUrl);if(a){if(!w(r)){u(e,`failed`,`Could not open ${a.model.name}`,[`The page could not be isolated for Blender in this browser. `+C],[T(e)]);return}await j(e,a.model,a.sidecars,n,null).catch(()=>!1)}}async function k(e,t,n,r,i,a,o){return await E(e)?w(e.defaultView)?j(e,t,n,r,i,a,o).catch(e=>(a?.({stage:`failed`,why:e instanceof Error?e.message:String(e)}),!1)):(a?.({stage:`failed`,why:`the window is not isolated`}),u(e,`failed`,`Could not open ${t.name}`,[`The window could not be isolated for Blender in this browser. `+C],[i]),!1):(a?.({stage:`failed`,why:`Blender is not served beside this page`}),u(e,`failed`,`Cannot open ${t.name} here`,[C],[i]),!1)}async function A(e,t){let n=e.defaultView,r=await o(n),a=await i(r.store,r.scopeUrl);a&&await l(e,{...a,bytesOf:e=>r.store.get(e)},t)}async function j(t,n,i,l,p,C,w){let E=t.defaultView,D=p??T(t),O=n.name.replace(/\.blend$/i,``),k=e=>u(t,`converting`,`Opening ${n.name}`,e),A=r(k,{now:()=>Date.now(),every:(e,t)=>{let n=E.setInterval(t,e);return()=>E.clearInterval(n)}}),j={set(e){A.set(e),e.step===`loading`?C?.({stage:`loading`,...e.loaded!==void 0&&e.total?{percent:Math.round(100*e.loaded/e.total)}:{}}):C?.({stage:e.step===`converting`?`converting`:`starting`})},stop:()=>A.stop()},M=(e,n)=>(j.stop(),C?.({stage:`failed`,why:`${e}: ${n.join(` `)}`}),u(t,`failed`,e,n,[D]),!1);j.set({step:`loading`});let N;try{N=(await e(()=>import(new URL(b,t.baseURI).href),[],import.meta.url)).createBlenderRunner({runtimeUrl:new URL(y,t.baseURI).href,threads:!0,onProgress:e=>{e.phase===`download`?j.set({step:`loading`,loaded:e.loaded,total:e.total}):e.phase===`compile`?j.set({step:`preparing`}):j.set({step:`starting`})}})}catch(e){return M(`Could not open ${n.name}`,[`Blender could not be loaded: ${e instanceof Error?e.message:String(e)}`])}let P={"/in/scene.blend":n.bytes,"/in/blend_export.py":new TextEncoder().encode(h)};for(let[e,t]of i)P[`/in/${e}`]=t;let F=[`import sys`,`sys.argv = ['blender', '--', '/in/scene.blend', '${g}', '${_}', '${x}', '${S}', '', 'JPEG']`,`exec(compile(open("/in/blend_export.py").read(), "/in/blend_export.py", "exec"))`].join(`
`),I=[],L;try{L=await N.run({code:F,blendFile:`/in/scene.blend`,files:P,onLine:e=>{w?.(e),!(!/\S/.test(e)||/Warning|warning:|^\s|Traceback/.test(e))&&(I.push(e.replace(/^\d\d:\d\d:\d\d \| /,``).trim()),I.length>6&&I.shift(),j.set({step:`converting`,file:n.name,tail:[...I]}))}})}catch(e){let t=e;return M(`Blender could not convert ${n.name}`,[t.message,...t.output?t.output.split(`
`).slice(-6):[]])}j.stop(),C?.({stage:`converted`});let R;try{let e=v(L.files);R=await s({name:n.name,bytes:n.bytes,files:i,converted:e},{toolVersion:`webverse`,title:O,forceMaterialDefaults:!0,...await c()})}catch(e){return M(`Could not open ${n.name}`,[e instanceof Error?e.message:String(e),...L.output.split(`
`).slice(-4)])}try{C?.({stage:`staging`});let{staged:e,files:r}=await d(t,R),i=await o(E);await a(i.store,i.scopeUrl,{documentUrl:e.documentUrl,title:R.title,modelName:n.name,lines:f(R),files:r})}catch(e){return M(`Could not open ${n.name}`,[e instanceof Error?e.message:String(e)])}return p!==null||(k([`Converted. Opening the world.`]),E.location.replace(m(E.location.href)),!0)}export{k as convertInWindow,D as importBlend,A as resumeOpenedWorld,O as resumePendingImport};
//# sourceMappingURL=blendImport-7vGvG_IP.js.map