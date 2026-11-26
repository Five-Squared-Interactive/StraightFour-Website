# The default avatar

`default.glb` is what a person in a shared world looks like when they have
said nothing about how they look: a rigged mannequin, 1.76 m tall, feet on
the ground at its origin, facing +Z, with two animation clips — `idle` and
`walk`. Seventeen joints, no textures, about 240 KB. Two simple eyes on
the face (#425), parented to the head bone. Three materials: the body's is
named `tint`, which is the one a person's colour goes on
(`specs/veml/profiles/client-hints.md`), so the eyes (`eye-white`,
`eye-pupil`) keep their own.

It is **generated**, not authored. `tooling/avatar/build_default_avatar.py`
builds it from nothing in Blender and exports it; the file here is that
script's output and nothing else. Regenerate it with:

```
blender --background --factory-startup --python tooling/avatar/build_default_avatar.py -- public/avatars/default.glb
```

`tests/unit/scriptEntityApiAvatar.test.ts` loads this exact file through
the shell's real glTF path and checks it still has its rig and both clips,
so a regeneration that drops either fails there first.

## Provenance and licence

Five Squared's own work, MIT like the rest of the shell. No third-party
mesh, rig or animation is used. It deliberately is *not* the export from
the earlier UMA-based avatar creator (`FiveSquaredAvatar`), whose one
export is malformed glTF — texture references with no index, and vertices
weighted to bones the exporter pruned — and which no glTF loader accepts as
it stands. The founder's direction: *"you dont need to use the same avatar,
you can make a comparable one."*

## What it is for

The shell draws a remote member with this model on their first
`state/transform`, labels it with their tag, walks the model while their
position is changing and idles it when it stops. A per-member avatar (a URL
a member brings with them) is a later slice and needs one optional field on
the roster entry in the WorldSync grammar — Tier 1 — so it is not here yet.
