import{t as e}from"./preload-helper-HclGiUj8.js";async function t(t){let r=n(await t),[i,a,{QuickJSWASMModule:o}]=await Promise.all([r.importModuleLoader().then(n),r.importFFI(),e(()=>import(`./module-ES6BEMUI-CDTIpMiA.js`).then(n),[],import.meta.url)]),s=await i();return s.type=`sync`,new o(s,new a(s))}function n(e){return e&&`default`in e&&e.default?e.default&&`default`in e.default&&e.default.default?e.default.default:e.default:e}var r={type:`sync`,importFFI:()=>e(()=>import(`./ffi-4V2b7xu3.js`).then(e=>e.QuickJSFFI),[],import.meta.url),importModuleLoader:()=>e(()=>import(`./emscripten-module.browser-XIKQQPVU-CjcPeGu2.js`).then(e=>e.default),[],import.meta.url)},i=`
(function () {
  var store = Object.create(null);
  var nextId = 1;
  globalThis.__cb = {
    store: function (fn) {
      // A named-global-string callback (the legacy World API convention) resolves to
      // its global function; a real closure is stored directly. Anything
      // non-callable is rejected (returns 0 — an id that never resumes).
      var target = fn;
      if (typeof target === 'string') {
        target = globalThis[target];
      }
      if (typeof target !== 'function') {
        return 0;
      }
      var id = nextId++;
      store[id] = target;
      return id;
    },
    resume: function (id, argsJson) {
      // Own-property guard: a wire id must never resolve to a prototype member.
      if (!Object.prototype.hasOwnProperty.call(store, id)) {
        return;
      }
      var fn = store[id];
      var args = [];
      if (typeof argsJson === 'string' && argsJson.length > 0) {
        try {
          var parsed = JSON.parse(argsJson);
          if (Array.isArray(parsed)) {
            args = parsed;
          }
        } catch (e) {
          args = [];
        }
      }
      var ret = fn.apply(undefined, args);
      // A callback (timer / onLoaded / CallAsynchronously) may be an
      // ASYNC function whose returned promise REJECTS later; that rejection would
      // otherwise be dropped silently (no host rejection tracker in emscripten-core
      // 0.32). Route it to console.error — the SAME surface a SYNC handler throw uses.
      // __reportAsyncError is defined by the World-API prelude (injected AFTER this
      // bootstrap; present by the time resume runs at tick time).
      if (ret && typeof ret.then === 'function') {
        ret.then(undefined, function (e) {
          if (typeof globalThis.__reportAsyncError === 'function') {
            globalThis.__reportAsyncError(e);
          }
        });
      }
      return ret;
    },
    release: function (id) {
      if (Object.prototype.hasOwnProperty.call(store, id)) {
        delete store[id];
      }
    },
    // The count of live stored callbacks, so a test can prove that a
    // re-registered message callback does NOT leak store entries over N
    // re-registrations. Own-property-safe key count.
    count: function () {
      return Object.keys(store).length;
    },
  };

  // Timer shims — store the callback + hand the integer id to the host.
  // The World API's Time.* (in the prelude) rides the same plumbing.
  globalThis.setTimeout = function (fn, ms) {
    var id = globalThis.__cb.store(fn);
    if (id === 0) return 0;
    return globalThis.__scheduleTimer('timeout', id, (ms | 0));
  };
  globalThis.setInterval = function (fn, ms) {
    var id = globalThis.__cb.store(fn);
    if (id === 0) return 0;
    return globalThis.__scheduleTimer('interval', id, (ms | 0));
  };
  globalThis.clearTimeout = function (timerId) {
    globalThis.__clearTimer(timerId | 0);
  };
  globalThis.clearInterval = function (timerId) {
    globalThis.__clearTimer(timerId | 0);
  };
})();
`,a=`
(function () {
  'use strict';
  var G = globalThis;
  var hasOwn = Object.prototype.hasOwnProperty;

  function defGetter(ctor, name, fn) {
    Object.defineProperty(ctor, name, { get: fn, configurable: false, enumerable: false });
  }

  // ==================== WorldTypes ====================

  // ---- Vector3 ----
  function Vector3(x, y, z) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
    this.z = z === undefined ? 0 : z;
  }
  defGetter(Vector3.prototype, 'magnitude', function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  });
  defGetter(Vector3.prototype, 'squaredMagnitude', function () {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  });
  Vector3.prototype.GetNormalized = function () {
    var m = this.magnitude; var s = m === 0 ? 0 : 1 / m;
    return new Vector3(this.x * s, this.y * s, this.z * s);
  };
  Vector3.prototype.Normalize = function () {
    var m = this.magnitude; var s = m === 0 ? 0 : 1 / m;
    this.x *= s; this.y *= s; this.z *= s;
  };
  Vector3.prototype.AreEqual = function (o) {
    return !!o && o.x === this.x && o.y === this.y && o.z === this.z;
  };
  Vector3.prototype.ToString = function () {
    return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
  };
  defGetter(Vector3, 'zero', function () { return new Vector3(0, 0, 0); });
  defGetter(Vector3, 'one', function () { return new Vector3(1, 1, 1); });
  defGetter(Vector3, 'up', function () { return new Vector3(0, 1, 0); });
  defGetter(Vector3, 'down', function () { return new Vector3(0, -1, 0); });
  defGetter(Vector3, 'left', function () { return new Vector3(-1, 0, 0); });
  defGetter(Vector3, 'right', function () { return new Vector3(1, 0, 0); });
  defGetter(Vector3, 'forward', function () { return new Vector3(0, 0, 1); });
  defGetter(Vector3, 'back', function () { return new Vector3(0, 0, -1); });
  defGetter(Vector3, 'positiveInfinity', function () { return new Vector3(Infinity, Infinity, Infinity); });
  defGetter(Vector3, 'negativeInfinity', function () { return new Vector3(-Infinity, -Infinity, -Infinity); });
  Vector3.GetDotProduct = function (a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; };
  Vector3.GetCrossProduct = function (a, b) {
    return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  };
  Vector3.GetDistance = function (a, b) {
    var dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };
  Vector3.GetAngle = function (a, b) {
    var m = a.magnitude * b.magnitude;
    if (m === 0) return 0;
    var c = Vector3.GetDotProduct(a, b) / m;
    if (c > 1) c = 1; if (c < -1) c = -1;
    return Math.acos(c) * 180 / Math.PI;
  };
  Vector3.LinearlyInterpolatePercent = function (a, b, t) {
    if (t < 0) t = 0; if (t > 1) t = 1;
    return new Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
  };
  Vector3.LinearlyInterpolatePercentUnclamped = function (vector1, vector2, percent) {
    return new Vector3(vector1.x + (vector2.x - vector1.x) * percent, vector1.y + (vector2.y - vector1.y) * percent, vector1.z + (vector2.z - vector1.z) * percent);
  };
  // Move from vector1 toward vector2 by at most maxDistance; a negative
  // distance moves away. Arriving exactly returns vector2.
  Vector3.LinearlyInterpolate = function (vector1, vector2, maxDistance) {
    var tx = vector2.x - vector1.x, ty = vector2.y - vector1.y, tz = vector2.z - vector1.z;
    var sq = tx * tx + ty * ty + tz * tz;
    if (sq === 0 || (maxDistance >= 0 && sq <= maxDistance * maxDistance)) return new Vector3(vector2.x, vector2.y, vector2.z);
    var d = Math.sqrt(sq);
    return new Vector3(vector1.x + tx / d * maxDistance, vector1.y + ty / d * maxDistance, vector1.z + tz / d * maxDistance);
  };
  // The component of vector along normal; a zero normal projects to zero.
  Vector3.Project = function (vector, normal) {
    var sq = Vector3.GetDotProduct(normal, normal);
    if (sq < 1.17549435e-38) return new Vector3(0, 0, 0);
    var k = Vector3.GetDotProduct(vector, normal) / sq;
    return new Vector3(normal.x * k, normal.y * k, normal.z * k);
  };
  // vector with its component along the plane's normal removed; a zero normal leaves it whole.
  Vector3.ProjectOnPlane = function (vector, normalOfPlane) {
    var sq = Vector3.GetDotProduct(normalOfPlane, normalOfPlane);
    if (sq < 1.17549435e-38) return new Vector3(vector.x, vector.y, vector.z);
    var k = Vector3.GetDotProduct(vector, normalOfPlane) / sq;
    return new Vector3(vector.x - normalOfPlane.x * k, vector.y - normalOfPlane.y * k, vector.z - normalOfPlane.z * k);
  };
  // Reflect vector off the plane the normal describes (the normal is used as given).
  Vector3.GetReflectedVector = function (vector, normal) {
    var f = -2 * Vector3.GetDotProduct(normal, vector);
    return new Vector3(f * normal.x + vector.x, f * normal.y + vector.y, f * normal.z + vector.z);
  };
  // The angle between two vectors in degrees, signed by whether their cross
  // product points along axis; a zero cross product reads as positive.
  Vector3.GetSignedAngle = function (vector1, vector2, axis) {
    var c = Vector3.GetCrossProduct(vector1, vector2);
    var sign = Vector3.GetDotProduct(axis, c) >= 0 ? 1 : -1;
    return Vector3.GetAngle(vector1, vector2) * sign;
  };
  Vector3.GetMin = function (vector1, vector2) {
    return new Vector3(Math.min(vector1.x, vector2.x), Math.min(vector1.y, vector2.y), Math.min(vector1.z, vector2.z));
  };
  Vector3.GetMax = function (vector1, vector2) {
    return new Vector3(Math.max(vector1.x, vector2.x), Math.max(vector1.y, vector2.y), Math.max(vector1.z, vector2.z));
  };
  // The vector, shortened to maxLength when longer.
  Vector3.GetClampedVector3 = function (vector, maxLength) {
    var sq = vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
    if (sq > maxLength * maxLength) {
      var k = maxLength / Math.sqrt(sq);
      return new Vector3(vector.x * k, vector.y * k, vector.z * k);
    }
    return new Vector3(vector.x, vector.y, vector.z);
  };
  // A unit vector perpendicular to a unit n: whichever axis pairing is well conditioned.
  function orthoNormalVector(n) {
    if (Math.abs(n.z) > 0.7071067811865476) {
      var a = 1 / Math.sqrt(n.y * n.y + n.z * n.z);
      return new Vector3(0, -n.z * a, n.y * a);
    }
    var b = 1 / Math.sqrt(n.x * n.x + n.y * n.y);
    return new Vector3(-n.y * b, n.x * b, 0);
  }
  // Normalise vector1 and make vector2 unit and perpendicular to it; a
  // vector2 along vector1 becomes some unit perpendicular. The legacy API
  // returns a pair as Item1 (the normal) and Item2 (the tangent).
  Vector3.prototype.GetNormalizedAndOrthagonal = function (vector1, vector2) {
    var m = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y + vector1.z * vector1.z);
    var n = m > 1e-6 ? new Vector3(vector1.x / m, vector1.y / m, vector1.z / m) : new Vector3(1, 0, 0);
    var d = Vector3.GetDotProduct(vector2, n);
    var t = new Vector3(vector2.x - n.x * d, vector2.y - n.y * d, vector2.z - n.z * d);
    var tm = t.magnitude;
    if (tm > 1e-6) { t.x /= tm; t.y /= tm; t.z /= tm; } else { t = orthoNormalVector(n); }
    return { Item1: n, Item2: t };
  };

  // ---- Vector2 / Vector4 (cheap siblings) ----
  function Vector2(x, y) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
  }
  defGetter(Vector2.prototype, 'magnitude', function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  });
  Vector2.prototype.ToString = function () { return '(' + this.x + ', ' + this.y + ')'; };
  defGetter(Vector2, 'zero', function () { return new Vector2(0, 0); });
  defGetter(Vector2, 'one', function () { return new Vector2(1, 1); });

  function Vector4(x, y, z, w) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
    this.z = z === undefined ? 0 : z;
    this.w = w === undefined ? 0 : w;
  }
  Vector4.prototype.ToString = function () {
    return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
  };
  defGetter(Vector4, 'zero', function () { return new Vector4(0, 0, 0, 0); });
  defGetter(Vector4, 'one', function () { return new Vector4(1, 1, 1, 1); });

  // ---- Quaternion ----
  // NOTE: the parameterless ctor is (0,0,0,0), NOT identity, as in the legacy API.
  // Two shapes: (x, y, z, w) components, or (angle, axis) — degrees about a
  // Vector3, as the legacy API's second constructor. A zero axis is the identity.
  function Quaternion(x, y, z, w) {
    if (y !== null && typeof y === 'object' && z === undefined && w === undefined) {
      var ax = y.x, ay = y.y, az = y.z;
      var am = Math.sqrt(ax * ax + ay * ay + az * az);
      if (!(am > 1e-6) || typeof x !== 'number' || x !== x) { this.x = 0; this.y = 0; this.z = 0; this.w = 1; return; }
      var half = x * DEG2RAD / 2, sn = Math.sin(half) / am;
      this.x = ax * sn; this.y = ay * sn; this.z = az * sn; this.w = Math.cos(half);
      return;
    }
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
    this.z = z === undefined ? 0 : z;
    this.w = w === undefined ? 0 : w;
  }
  var DEG2RAD = Math.PI / 180, RAD2DEG = 180 / Math.PI;
  defGetter(Quaternion, 'identity', function () { return new Quaternion(0, 0, 0, 1); });
  Quaternion.Combine = function (a, b) {
    // Hamilton product (the '*' operator's impl — pure math).
    return new Quaternion(
      a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
      a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
      a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
      a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
    );
  };
  Quaternion.GetDotProduct = function (a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  };
  Quaternion.GetNormalized = function (q) {
    var m = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    var s = m === 0 ? 0 : 1 / m;
    return new Quaternion(q.x * s, q.y * s, q.z * s, q.w * s);
  };
  Quaternion.prototype.AreEqual = function (o) {
    return !!o && o.x === this.x && o.y === this.y && o.z === this.z && o.w === this.w;
  };
  Quaternion.prototype.ToString = function () {
    return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
  };
  // The angle between two rotations in degrees; rotations within 1e-6 of equal read as 0.
  Quaternion.GetAngle = function (quaternion1, quaternion2) {
    var d = Math.min(Math.abs(Quaternion.GetDotProduct(quaternion1, quaternion2)), 1);
    return d > 1 - 1e-6 ? 0 : Math.acos(d) * 2 * RAD2DEG;
  };
  // Euler angles in degrees: z about z, then x about x, then y about y, each
  // about the world axes (left-handed, +y up) — the product Qy·Qx·Qz.
  Quaternion.FromEulerAngles = function (x, y, z) {
    var hx = x * DEG2RAD / 2, hy = y * DEG2RAD / 2, hz = z * DEG2RAD / 2;
    var cX = Math.cos(hx), sX = Math.sin(hx), cY = Math.cos(hy), sY = Math.sin(hy), cZ = Math.cos(hz), sZ = Math.sin(hz);
    return new Quaternion(
      sX * cY * cZ + cX * sY * sZ,
      cX * sY * cZ - sX * cY * sZ,
      cX * cY * sZ - sX * sY * cZ,
      cX * cY * cZ + sX * sY * sZ
    );
  };
  // Each angle in [0, 360): a value within 0.0001 rad under zero reads as zero.
  function makePositive(deg) {
    var negativeFlip = -0.0001 * RAD2DEG, positiveFlip = 360 + negativeFlip;
    if (deg < negativeFlip) return deg + 360;
    if (deg > positiveFlip) return deg - 360;
    return deg;
  }
  // The inverse of FromEulerAngles: the same order, read back from the
  // rotation matrix. At the poles (x = ±90°) z is 0 and y carries the rest.
  Quaternion.prototype.GetEulerAngles = function () {
    var n = Quaternion.GetNormalized(this), x = n.x, y = n.y, z = n.z, w = n.w;
    var m12 = 2 * (y * z - w * x);
    var ex, ey, ez;
    if (m12 < 0.999999 && m12 > -0.999999) {
      ex = Math.asin(-m12);
      ey = Math.atan2(2 * (x * z + w * y), 1 - 2 * (x * x + y * y));
      ez = Math.atan2(2 * (x * y + w * z), 1 - 2 * (x * x + z * z));
    } else {
      var m00 = 1 - 2 * (y * y + z * z), m01 = 2 * (x * y - w * z);
      ex = m12 <= -0.999999 ? Math.PI / 2 : -Math.PI / 2;
      ey = m12 <= -0.999999 ? Math.atan2(m01, m00) : Math.atan2(-m01, m00);
      ez = 0;
    }
    return new Vector3(makePositive(ex * RAD2DEG), makePositive(ey * RAD2DEG), makePositive(ez * RAD2DEG));
  };
  // The rotation whose +z is forward and whose +y is as near up as that allows;
  // a zero forward, or an up along forward, gives the identity.
  Quaternion.CreateLookRotation = function (forward, up) {
    if (up === undefined) up = Vector3.up;
    var fm = forward.magnitude;
    if (!(fm > 1e-6)) return Quaternion.identity;
    var f = new Vector3(forward.x / fm, forward.y / fm, forward.z / fm);
    var r = Vector3.GetCrossProduct(up, f);
    var rm = r.magnitude;
    if (!(rm > 1e-6)) return Quaternion.identity;
    r.x /= rm; r.y /= rm; r.z /= rm;
    var u = Vector3.GetCrossProduct(f, r);
    // Columns r, u, f of the rotation matrix → quaternion.
    var m00 = r.x, m01 = u.x, m02 = f.x, m10 = r.y, m11 = u.y, m12 = f.y, m20 = r.z, m21 = u.z, m22 = f.z;
    var t = m00 + m11 + m22, q;
    if (t > 0) {
      var s = Math.sqrt(t + 1) * 2;
      q = new Quaternion((m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, 0.25 * s);
    } else if (m00 > m11 && m00 > m22) {
      var s0 = Math.sqrt(1 + m00 - m11 - m22) * 2;
      q = new Quaternion(0.25 * s0, (m01 + m10) / s0, (m02 + m20) / s0, (m21 - m12) / s0);
    } else if (m11 > m22) {
      var s1 = Math.sqrt(1 + m11 - m00 - m22) * 2;
      q = new Quaternion((m01 + m10) / s1, 0.25 * s1, (m12 + m21) / s1, (m02 - m20) / s1);
    } else {
      var s2 = Math.sqrt(1 + m22 - m00 - m11) * 2;
      q = new Quaternion((m02 + m20) / s2, (m12 + m21) / s2, 0.25 * s2, (m10 - m01) / s2);
    }
    return Quaternion.GetNormalized(q);
  };
  // The conjugate over the squared length: the inverse of any quaternion, the conjugate of a unit one.
  Quaternion.GetInverse = function (quaternion) {
    var sq = quaternion.x * quaternion.x + quaternion.y * quaternion.y + quaternion.z * quaternion.z + quaternion.w * quaternion.w;
    if (sq === 0) return new Quaternion(0, 0, 0, 0);
    return new Quaternion(-quaternion.x / sq, -quaternion.y / sq, -quaternion.z / sq, quaternion.w / sq);
  };
  // Blend toward the nearer spelling of quaternion2 (q and −q are one rotation), normalised.
  function lerpQuaternion(a, b, t) {
    var sign = Quaternion.GetDotProduct(a, b) < 0 ? -1 : 1;
    return Quaternion.GetNormalized(new Quaternion(
      a.x + (b.x * sign - a.x) * t, a.y + (b.y * sign - a.y) * t, a.z + (b.z * sign - a.z) * t, a.w + (b.w * sign - a.w) * t
    ));
  }
  Quaternion.LinearlyInterpolatePercent = function (quaternion1, quaternion2, percent) {
    if (percent < 0) percent = 0; if (percent > 1) percent = 1;
    return lerpQuaternion(quaternion1, quaternion2, percent);
  };
  Quaternion.LinearlyInterpolatePercentUnclamped = function (quaternion1, quaternion2, percent) {
    return lerpQuaternion(quaternion1, quaternion2, percent);
  };
  // Spherical interpolation along the shorter path; near-equal inputs blend linearly.
  function slerpQuaternion(a, b, t) {
    var d = Quaternion.GetDotProduct(a, b), sign = 1;
    if (d < 0) { d = -d; sign = -1; }
    if (d > 0.9995) return lerpQuaternion(a, b, t);
    var theta = Math.acos(d), st = Math.sin(theta);
    var wa = Math.sin((1 - t) * theta) / st, wb = Math.sin(t * theta) / st * sign;
    return new Quaternion(a.x * wa + b.x * wb, a.y * wa + b.y * wb, a.z * wa + b.z * wb, a.w * wa + b.w * wb);
  }
  Quaternion.SphericallyInterpolate = function (quaternion1, quaternion2, percent) {
    if (percent < 0) percent = 0; if (percent > 1) percent = 1;
    return slerpQuaternion(quaternion1, quaternion2, percent);
  };
  Quaternion.SphericallyInterpolateUnclamped = function (quaternion1, quaternion2, percent) {
    return slerpQuaternion(quaternion1, quaternion2, percent);
  };
  // Rotate from quaternion1 toward quaternion2 by at most maxDegrees.
  Quaternion.Interpolate = function (quaternion1, quaternion2, maxDegrees) {
    var angle = Quaternion.GetAngle(quaternion1, quaternion2);
    if (angle === 0) return new Quaternion(quaternion2.x, quaternion2.y, quaternion2.z, quaternion2.w);
    return slerpQuaternion(quaternion1, quaternion2, Math.min(1, maxDegrees / angle));
  };
  // The legacy name for the same step: a distance in degrees.
  Quaternion.LinearlyInterpolate = function (quaternion1, quaternion2, maxDistance) {
    return Quaternion.Interpolate(quaternion1, quaternion2, maxDistance);
  };
  // The shortest arc from one direction to another; antiparallel directions
  // turn half a circle about a perpendicular; a zero direction is the identity.
  Quaternion.GetRotationFromToVector3s = function (from, to) {
    var fm = from.magnitude, tm = to.magnitude;
    if (!(fm > 1e-6) || !(tm > 1e-6)) return Quaternion.identity;
    var f = new Vector3(from.x / fm, from.y / fm, from.z / fm), t = new Vector3(to.x / tm, to.y / tm, to.z / tm);
    var d = Vector3.GetDotProduct(f, t);
    if (d > 1 - 1e-6) return Quaternion.identity;
    if (d < -1 + 1e-6) {
      var axis = orthoNormalVector(f);
      return new Quaternion(axis.x, axis.y, axis.z, 0);
    }
    var s = Math.sqrt((1 + d) * 2), c = Vector3.GetCrossProduct(f, t);
    return Quaternion.GetNormalized(new Quaternion(c.x / s, c.y / s, c.z / s, s * 0.5));
  };
  // The angle in degrees and the unit axis; the identity's axis is (1, 0, 0).
  Quaternion.prototype.GetAngleAxis = function () {
    var n = Quaternion.GetNormalized(this);
    var w = Math.min(1, Math.max(-1, n.w));
    var angle = 2 * Math.acos(w);
    var s = Math.sqrt(1 - w * w);
    var axis = s < 1e-6 ? new Vector3(1, 0, 0) : new Vector3(n.x / s, n.y / s, n.z / s);
    return { Item1: angle * RAD2DEG, Item2: axis };
  };

  // ---- Color ---- (the legacy API has NO default ctor and NO ToString)
  function Color(r, g, b, a) {
    this.r = r; this.g = g; this.b = b; this.a = a;
  }
  defGetter(Color, 'black', function () { return new Color(0, 0, 0, 1); });
  defGetter(Color, 'blue', function () { return new Color(0, 0, 1, 1); });
  defGetter(Color, 'clear', function () { return new Color(0, 0, 0, 0); });
  defGetter(Color, 'cyan', function () { return new Color(0, 1, 1, 1); });
  defGetter(Color, 'gray', function () { return new Color(0.5, 0.5, 0.5, 1); });
  defGetter(Color, 'grey', function () { return new Color(0.5, 0.5, 0.5, 1); });
  defGetter(Color, 'green', function () { return new Color(0, 1, 0, 1); });
  defGetter(Color, 'magenta', function () { return new Color(1, 0, 1, 1); });
  defGetter(Color, 'red', function () { return new Color(1, 0, 0, 1); });
  defGetter(Color, 'white', function () { return new Color(1, 1, 1, 1); });
  defGetter(Color, 'yellow', function () { return new Color(1, 0.92, 0.016, 1); });

  // ---- EntityPhysicalProperties ----
  // A plain value class world scripts construct: \`new EntityPhysicalProperties(
  // angularDrag, centerOfMass, drag, gravitational, mass)\` (all nullable — a
  // typical call is \`(null, null, null, gravity, null)\`). Handed to
  // CharacterEntity.SetPhysicalProperties(props); crosses to the host as plain data.
  function EntityPhysicalProperties(angularDrag, centerOfMass, drag, gravitational, mass) {
    this.angularDrag = angularDrag === undefined ? null : angularDrag;
    this.centerOfMass = centerOfMass === undefined ? null : centerOfMass;
    this.drag = drag === undefined ? null : drag;
    this.gravitational = gravitational === undefined ? null : gravitational;
    this.mass = mass === undefined ? null : mass;
  }

  // ---- UUID ---- (randomness via the host bridge __uuid)
  var EMPTY_UUID = '00000000-0000-0000-0000-000000000000';
  function UUID(input) {
    this._value = (input === undefined || input === null) ? EMPTY_UUID : String(input);
  }
  UUID.NewUUID = function () {
    var s = (typeof G.__uuid === 'function') ? G.__uuid() : EMPTY_UUID;
    return new UUID(s || EMPTY_UUID);
  };
  UUID.Parse = function (input) { return new UUID(input); };
  UUID.prototype.ToString = function () { return this._value; };

  // ==================== Logging (host-bridged) ====================
  function logAt(level, message) {
    if (typeof G.__log === 'function') {
      G.__log(level, message === undefined || message === null ? '' : String(message));
    }
  }
  var Logging = {
    Type: { Default: 'default', Debug: 'debug', Warning: 'warning', Error: 'error' },
    Log: function (message, type) { logAt(typeof type === 'string' ? type : 'default', message); },
    LogDebug: function (message) { logAt('debug', message); },
    LogWarning: function (message) { logAt('warning', message); },
    LogError: function (message) { logAt('error', message); }
  };

  // ==================== Time (rides the callback-registry timer plumbing) ====================
  var intervalIds = Object.create(null); // uuid-string -> host timerId (own-prop-guarded)
  function toMs(seconds) {
    var s = Number(seconds);
    if (!isFinite(s) || s < 0) s = 0;
    return Math.round(s * 1000);
  }
  var Time = {
    // SetInterval(function, seconds) -> UUID. The callback is a closure OR a
    // function-NAME string (the legacy World API convention) — both ride __cb.store.
    SetInterval: function (fn, seconds) {
      var cbId = G.__cb.store(fn);
      if (cbId === 0) return null;
      var timerId = G.__scheduleTimer('interval', cbId, toMs(seconds));
      var uuid = UUID.NewUUID();
      intervalIds[uuid.ToString()] = timerId;
      return uuid;
    },
    // StopInterval(id) — accepts a UUID or its string form.
    StopInterval: function (id) {
      var key = (id && typeof id.ToString === 'function') ? id.ToString() : String(id);
      if (!hasOwn.call(intervalIds, key)) return false;
      G.__clearTimer(intervalIds[key]);
      delete intervalIds[key];
      return true;
    },
    // SetTimeout(function, seconds) -> fires once. Deliberately differs from the
    // legacy API's code-string + ms: a callback + seconds is safer (no code
    // string to evaluate) and matches SetInterval.
    SetTimeout: function (fn, seconds) {
      var cbId = G.__cb.store(fn);
      if (cbId === 0) return false;
      G.__scheduleTimer('timeout', cbId, toMs(seconds));
      return true;
    },
    // CallAsynchronously(function) — one-shot on the next tick.
    CallAsynchronously: function (fn) {
      var cbId = G.__cb.store(fn);
      if (cbId === 0) return false;
      G.__scheduleTimer('timeout', cbId, 0);
      return true;
    }
  };

  // ==================== Context (sandbox-side) ====================
  var CONTEXTS = Object.create(null);
  G.INTERNAL_CONTEXTS_ = CONTEXTS; // the global name legacy world scripts expect
  var Context = {
    DefineContext: function (name, value) {
      if (typeof name !== 'string') return;
      CONTEXTS[name] = value;
    },
    GetContext: function (name) {
      if (typeof name !== 'string' || !hasOwn.call(CONTEXTS, name)) return null;
      return CONTEXTS[name];
    }
  };

  // ==================== WorldStorage (host-bridged, world-scoped) ====================
  var WorldStorage = {
    SetItem: function (key, value) {
      G.__worldStorageSet(String(key), value === undefined || value === null ? null : String(value));
    },
    GetItem: function (key) {
      var v = G.__worldStorageGet(String(key));
      return v === undefined ? null : v;
    }
  };

  // ==================== LocalStorage (host-bridged, per world folder) ====================
  var LocalStorage = {
    SetItem: function (key, value) {
      G.__localStorageSet(String(key), value === undefined || value === null ? null : String(value));
    },
    GetItem: function (key) {
      var v = G.__localStorageGet(String(key));
      return v === undefined ? null : v;
    },
    RemoveItem: function (key) {
      G.__localStorageRemove(String(key));
    }
  };

  // ==================== console (v4-native) ====================
  // Routes to the SAME leveled runtime logger as Logging.* (via logAt → the host
  // __log bridge → the shell's runtime logger). Level map: log/info → 'default'
  // (log.info), debug → 'debug' (log.debug), warn → 'warning' (log.warn), error →
  // 'error' (log.error) — so the \`log\` reserved URL param governs console.* EXACTLY
  // as it governs Logging.*, and console.log + Logging.Log land in ONE place. The
  // legacy World API had NO console; this modern tier fills that gap. Multi-arg + object
  // stringify happens SANDBOX-SIDE (a plain string reaches the host — no live
  // handle crosses; toHostSafe is the backstop).
  function consoleStr(v) {
    if (typeof v === 'string') return v;
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'object') {
      // Read the ToString PROPERTY inside the try too — a throwing
      // ToString GETTER must not throw into the world (a diagnostic must never crash
      // the script). Fall through to guarded JSON.stringify → '[object]'.
      try { var ts = v.ToString; if (typeof ts === 'function') return String(ts.call(v)); } catch (e) {}
      try { return JSON.stringify(v); } catch (e) { return '[object]'; }
    }
    return String(v);
  }
  function consoleJoin(args) {
    var parts = [];
    for (var i = 0; i < args.length; i++) parts.push(consoleStr(args[i]));
    return parts.join(' ');
  }
  var consoleObj = {
    log: function () { logAt('default', consoleJoin(arguments)); },
    info: function () { logAt('default', consoleJoin(arguments)); },
    debug: function () { logAt('debug', consoleJoin(arguments)); },
    warn: function () { logAt('warning', consoleJoin(arguments)); },
    error: function () { logAt('error', consoleJoin(arguments)); }
  };

  // ==================== unhandled-rejection surfacing ====================
  // QuickJS-emscripten 0.32 has NO host promise-rejection tracker (the SETTER is
  // absent — applyBaseRuntimeOptions never reads promiseRejectionHandler; verified),
  // so a rejection that reaches no handler is otherwise dropped SILENTLY. We route
  // the two places the HOST discards a callback result (an async timer/onLoaded via
  // __cb.resume, an async input/on-load handler via sandbox.dispatch) + a
  // fire-and-forget *Async factory rejection to console.error — the SAME surface a
  // SYNC handler throw uses. A BARE Promise.reject not passed through our wrappers is
  // still dropped (the residual web-platform-limit).
  function reportAsyncError(err) {
    var msg = (err && err.message != null) ? err.message : err;
    consoleObj.error('Uncaught (in promise):', msg);
  }
  // Attach a rejection route to a value IF it is a thenable; return it unchanged.
  // Used by sandbox.dispatch on a handler's result (an async input/on-load handler
  // that throws → logged, dropped-not-fatal). A non-thenable value is untouched.
  function guardAsync(v) {
    if (v && typeof v.then === 'function') {
      v.then(undefined, function (e) { reportAsyncError(e); });
    }
    return v;
  }
  G.__reportAsyncError = reportAsyncError;
  G.__guardAsync = guardAsync;

  // ==================== Entity surface (handle-as-id) ====================
  // A handle is a SANDBOX-SIDE wrapper over an entity-ID string (this._id). Every
  // accessor calls a __entity*/__world*/__camera* host bridge keyed by the id;
  // NO live Babylon node ever crosses the boundary. Host returns are re-wrapped
  // as Vector3/Quaternion/handles here (the value types stay sandbox-side).

  function BaseEntity(id) { this._id = id == null ? null : String(id); }
  Object.defineProperty(BaseEntity.prototype, 'id', {
    get: function () { return new UUID(this._id); },
    configurable: false, enumerable: false
  });
  Object.defineProperty(BaseEntity.prototype, 'tag', {
    get: function () { var t = G.__entityGetTag(this._id); return t === undefined ? null : t; },
    configurable: false, enumerable: false
  });
  BaseEntity.prototype.GetPosition = function (local) {
    var p = G.__entityGetPosition(this._id, !!local);
    return p ? new Vector3(p.x, p.y, p.z) : null;
  };
  BaseEntity.prototype.SetPosition = function (position, local) {
    return G.__entitySetPosition(this._id, position, !!local);
  };
  BaseEntity.prototype.GetRotation = function (local) {
    var r = G.__entityGetRotation(this._id, !!local);
    return r ? new Quaternion(r.x, r.y, r.z, r.w) : null;
  };
  BaseEntity.prototype.SetRotation = function (rotation, local) {
    return G.__entitySetRotation(this._id, rotation, !!local);
  };
  BaseEntity.prototype.GetScale = function () {
    var s = G.__entityGetScale(this._id);
    return s ? new Vector3(s.x, s.y, s.z) : null;
  };
  BaseEntity.prototype.SetScale = function (scale) {
    return G.__entitySetScale(this._id, scale);
  };
  // ---- Transform: GetTransform / Size / Euler ----
  // GetTransform returns a PLAIN snapshot from the host (no live node crosses);
  // the value types are re-wrapped SANDBOX-SIDE as Vector3/Quaternion so a
  // script's \`.forward.x\`/\`.right.x\`/\`.position.x\` reads (and .magnitude etc.)
  // work. forward/right/up are in the runtime's LH Y-up convention (host-derived
  // from Babylon's own axes). Size is REAL-WORLD dimensions (distinct from Scale);
  // Euler is DEGREES (round-trips against the stored quaternion). The trailing
  // \`local\`/\`synchronizeChange\` args mirror the legacy API signature (sync ignored).
  BaseEntity.prototype.GetTransform = function () {
    var t = G.__entityGetTransform(this._id);
    if (!t) return null;
    return {
      position: new Vector3(t.position.x, t.position.y, t.position.z),
      rotation: new Quaternion(t.rotation.x, t.rotation.y, t.rotation.z, t.rotation.w),
      scale: new Vector3(t.scale.x, t.scale.y, t.scale.z),
      forward: new Vector3(t.forward.x, t.forward.y, t.forward.z),
      right: new Vector3(t.right.x, t.right.y, t.right.z),
      up: new Vector3(t.up.x, t.up.y, t.up.z)
    };
  };
  BaseEntity.prototype.SetSize = function (size, synchronizeChange) {
    return G.__entitySetSize(this._id, size);
  };
  BaseEntity.prototype.GetSize = function () {
    var s = G.__entityGetSize(this._id);
    return s ? new Vector3(s.x, s.y, s.z) : null;
  };
  BaseEntity.prototype.SetEulerRotation = function (euler, local, synchronizeChange) {
    return G.__entitySetEulerRotation(this._id, euler, !!local);
  };
  BaseEntity.prototype.GetEulerRotation = function (local) {
    var e = G.__entityGetEulerRotation(this._id, !!local);
    return e ? new Vector3(e.x, e.y, e.z) : null;
  };
  BaseEntity.prototype.GetParent = function () {
    var pid = G.__entityGetParent(this._id);
    return pid ? wrapEntity(pid) : null;
  };
  BaseEntity.prototype.SetParent = function (parent) {
    var pid = (parent && parent._id != null) ? parent._id : null;
    return G.__entitySetParent(this._id, pid);
  };
  BaseEntity.prototype.GetChildren = function () {
    var ids = G.__entityGetChildren(this._id);
    var out = [];
    if (ids && ids.length) { for (var i = 0; i < ids.length; i++) out.push(wrapEntity(ids[i])); }
    return out;
  };
  BaseEntity.prototype.SetVisibility = function (visible) {
    return G.__entitySetVisibility(this._id, !!visible);
  };
  BaseEntity.prototype.GetVisibility = function () {
    return G.__entityGetVisibility(this._id);
  };
  BaseEntity.prototype.SetHighlight = function (highlight) {
    return G.__entitySetHighlight(this._id, !!highlight);
  };
  BaseEntity.prototype.GetHighlight = function () {
    return G.__entityGetHighlight(this._id);
  };
  BaseEntity.prototype.Delete = function () {
    return G.__entityDelete(this._id);
  };
  BaseEntity.prototype.Compare = function (other) {
    return !!other && G.__entityCompare(this._id, other._id);
  };

  // ---- BaseEntity interaction state (Static/Hidden/Physical/Placing) ----
  // TOLERANT: SetInteractionState never throws — a
  // forged/unknown state degrades to false host-side. Hidden↔visibility-off,
  // Static real, Physical/Placing degrade to Static (v4 has no physics
  // engine). The state crosses as a plain STRING (the InteractionState enum
  // values), never a live node.
  BaseEntity.prototype.SetInteractionState = function (state) {
    return G.__entitySetInteractionState(this._id, String(state));
  };
  BaseEntity.prototype.GetInteractionState = function () {
    var s = G.__entityGetInteractionState(this._id);
    return s === undefined ? null : s;
  };

  // ---- LightEntity type + properties, on BaseEntity.prototype ----
  // v4 handle-as-id: every onLoaded/lookup handle is structurally a BaseEntity,
  // so the light setters live here; the HOST guards that the id names a light
  // (else false + warn). SetLightType takes the LightType enum string
  // ('directional'/'point'/'spot'); SetLightProperties folds the legacy API's three
  // overloads into ONE plain-data spec {color,intensity,range,innerSpotAngle,
  // outerSpotAngle,temperature} — a Color crosses as {r,g,b,a}, never a node.
  // ---- UI methods on BaseEntity.prototype (handle-as-id) ----
  // Every onLoaded/lookup handle is structurally a BaseEntity (wrapEntity returns
  // a BaseEntity), so SetText/GetText + MakeScreenCanvas/etc. live HERE (like the
  // light methods); the HOST guards the entity type (a non-text/input SetText
  // → false; a non-canvas MakeScreenCanvas → false). SetText/GetText drive a
  // text/input entity's live DynamicTexture glyph content. MakeScreenCanvas
  // degrades to WORLD-SPACE: it SUCCEEDS (a script's call chain must
  // not break) but does NOT change render mode / reposition; IsScreenCanvas → false.
  BaseEntity.prototype.SetText = function (text) {
    return G.__entitySetText(this._id, text == null ? '' : String(text));
  };
  BaseEntity.prototype.GetText = function () {
    var t = G.__entityGetText(this._id);
    return t === undefined ? null : t;
  };
  BaseEntity.prototype.MakeScreenCanvas = function (synchronize) {
    return G.__canvasMakeScreen(this._id);
  };
  BaseEntity.prototype.MakeWorldCanvas = function () {
    return G.__canvasMakeWorld(this._id);
  };
  // ---- PlaceCameraOn on BaseEntity.prototype (camera-follows-entity) ----
  // PlaceCameraOn parents the camera to the entity — the desktop third-person
  // path (a script typically follows with Camera.SetPosition(0,1,-2, true) for
  // the offset). Structurally every handle is a BaseEntity (like the light /
  // UI methods), so it lives here.
  BaseEntity.prototype.PlaceCameraOn = function () {
    return G.__entityPlaceCameraOn(this._id);
  };
  // ---- CharacterEntity Move/Jump/SetPhysicalProperties/GetPhysicalProperties ----
  // On BaseEntity.prototype (handle-as-id — every onLoaded/lookup handle is
  // structurally a BaseEntity; the host GUARDS the id names a character → else
  // false/null). Kinematic without a body (a Physical one has one): Move = grounded collision-
  // resolved WORLD displacement (SAME primitives as the player); Jump = grounded-
  // gated vertical arc; SetPhysicalProperties RECORDS the props (gravitational
  // toggles SURFACE↔FREE, the rest recorded-not-simulated). A Vector3 / the props
  // object crosses as PLAIN DATA (never a live node).
  BaseEntity.prototype.Move = function (amount) {
    return G.__characterMove(this._id, amount);
  };
  BaseEntity.prototype.Jump = function (amount, discardIfFalling) {
    // Legacy API signature: Jump(float amount, bool discardIfFalling = true).
    return G.__characterJump(this._id, amount, discardIfFalling === undefined ? true : !!discardIfFalling);
  };
  BaseEntity.prototype.SetPhysicalProperties = function (properties) {
    return G.__characterSetPhysicalProperties(this._id, properties);
  };
  BaseEntity.prototype.GetPhysicalProperties = function () {
    var p = G.__characterGetPhysicalProperties(this._id);
    if (!p) return null;
    // Re-wrap centerOfMass as a Vector3 sandbox-side (value types stay sandbox-side).
    var com = (p.centerOfMass && typeof p.centerOfMass === 'object')
      ? new Vector3(p.centerOfMass.x, p.centerOfMass.y, p.centerOfMass.z) : null;
    return new EntityPhysicalProperties(
      p.angularDrag === undefined ? null : p.angularDrag,
      com,
      p.drag === undefined ? null : p.drag,
      p.gravitational === undefined ? null : p.gravitational,
      p.mass === undefined ? null : p.mass
    );
  };
  BaseEntity.prototype.IsScreenCanvas = function () {
    return G.__canvasIsScreen(this._id);
  };
  BaseEntity.prototype.SetLightType = function (type) {
    return G.__lightSetType(this._id, String(type));
  };
  BaseEntity.prototype.SetLightProperties = function (a, b, c, d, e, f) {
    var spec = {};
    if (a && typeof a === 'object' && a.r !== undefined) {
      // Overload 1: (color, temperature, intensity)
      spec.color = a; spec.temperature = b; spec.intensity = c;
    } else if (a && typeof a === 'object') {
      // v4-native: a single plain {color?,intensity?,range?,...} spec object.
      spec = a;
    } else if (typeof a === 'number' && d && typeof d === 'object' && d.r !== undefined) {
      // Overload 2: (range, innerSpotAngle, outerSpotAngle, color, temperature, intensity)
      spec.range = a; spec.innerSpotAngle = b; spec.outerSpotAngle = c;
      spec.color = d; spec.temperature = e; spec.intensity = f;
    } else if (typeof a === 'number') {
      // Overload 3: (range, intensity)
      spec.range = a; spec.intensity = b;
    }
    return G.__lightSetProperties(this._id, spec);
  };

  function wrapEntity(id) { return new BaseEntity(id); }

  // Named-function-string (the legacy World API convention) OR closure callback
  // — invoked with the reconstructed handle. RETURN the
  // user fn's result so __cb.resume can route an async user-callback's rejection.
  function invokeUserCallback(cb, handle) {
    var f = cb;
    if (typeof f === 'string') { f = G[f]; }
    if (typeof f === 'function') { return f(handle); }
  }
  // Mint a hollow handle synchronously; onLoaded fires on a SUBSEQUENT tick
  // (deferResume) with the reconstructed handle (the id never leaves the sandbox
  // for the callback). Returns the handle. An OPTIONAL onError
  // (message) is the ASYNC-failure channel — the host mesh-load path fires it when
  // an async glb load fails, so createAsync can REJECT (not resolve to a dead
  // handle / stall). The two callbacks MUTUALLY RELEASE each other on settle (a
  // settled guard) so a create leaks NEITHER __cb id intra-world; a sync-null
  // return releases both. When onError is absent (the sync Create path) behavior is
  // unchanged — the host fires onLoaded on both success and failure.
  function doCreate(spec, onLoaded, onError) {
    var handle = null;
    var settled = false;
    var loadedCbId = 0;
    var errorCbId = 0;
    if (onLoaded != null) {
      loadedCbId = G.__cb.store(function () {
        if (settled) return; settled = true;
        if (errorCbId) G.__cb.release(errorCbId);
        return invokeUserCallback(onLoaded, handle);
      });
    }
    if (onError != null) {
      errorCbId = G.__cb.store(function (msg) {
        if (settled) return; settled = true;
        if (loadedCbId) G.__cb.release(loadedCbId);
        onError(msg);
      });
    }
    var id = G.__entityCreate(spec, loadedCbId, errorCbId);
    if (id == null) {
      if (loadedCbId) G.__cb.release(loadedCbId);
      if (errorCbId) G.__cb.release(errorCbId);
      return null;
    }
    handle = wrapEntity(id);
    return handle;
  }
  function parentId(parent) { return (parent && parent._id != null) ? parent._id : null; }
  function orNullId(id) { return id != null ? String(id) : null; }

  // The v4-native PROMISE form of doCreate. Wraps the SAME sync
  // hollow-handle + deferred-onLoaded mechanism: the promise's
  // resolve BECOMES the onLoaded callback, so \`await MeshEntity.CreateCubeAsync(...)\`
  // resolves to the SAME handle the sync CreateCube returns — registry-identical,
  // walkable after SetVisibility(true), disposable. The promise settles when the
  // entity is LIVE (onLoaded fires on a later tick; the host pumps the job queue
  // in tick() so the awaiting continuation then runs). A creation that FAILS
  // SYNCHRONOUSLY (bad/forged spec, absent entityApi → __entityCreate returns
  // null → doCreate returns null) REJECTS with a catchable Error, NEVER an
  // uncaught host throw. Handle-as-id preserved: the promise resolves to a
  // sandbox-side handle (an id wrapper), no live Babylon node crosses.
  function createAsync(spec) {
    var p = new Promise(function (resolve, reject) {
      var h = doCreate(
        spec,
        function (loaded) { resolve(loaded); },
        function (msg) { reject(new Error(typeof msg === 'string' && msg ? msg : 'entity load failed')); }
      );
      if (h == null) { reject(new Error('entity creation failed')); }
    });
    return makeAsyncResult(p);
  }

  // A THENABLE WRAPPER around the native factory promise so a
  // fire-and-forget rejection is SURFACED (there is no engine rejection tracker in
  // emscripten-core 0.32). QuickJS \`await\` on a NATIVE promise bypasses the JS-level
  // .then, but \`await\` on a NON-native thenable calls .then via
  // PromiseResolveThenableJob — so any consumption (await / .then / .catch) sets
  // \`handled\`, and an internal reaction reports via console.error ONLY if the wrapper
  // is still untouched one microtask after the native promise rejects. An AWAITED /
  // caught rejection stays catchable and is NOT double-logged; the resolved value is
  // the SAME registry-identical handle.
  function makeAsyncResult(nativePromise) {
    var handled = false;
    nativePromise.then(undefined, function (err) {
      // Defer one microtask so a synchronous await/.then/.catch (registered right
      // after createAsync returns) flips \`handled\` before we decide to report.
      Promise.resolve().then(function () { if (!handled) reportAsyncError(err); });
    });
    return {
      then: function (onF, onR) { handled = true; return nativePromise.then(onF, onR); },
      catch: function (onR) { handled = true; return nativePromise.then(undefined, onR); },
      finally: function (onFin) {
        handled = true;
        return nativePromise.then(
          function (v) { if (typeof onFin === 'function') onFin(); return v; },
          function (e) { if (typeof onFin === 'function') onFin(); throw e; }
        );
      }
    };
  }

  // The SINGLE-SOURCE spec/arg-fold. Each sync factory AND its
  // *Async twin build the spec through the SAME builder, so a sync-only spec change
  // cannot silently diverge the async form. (A positional resolver-append is NOT
  // used because MeshEntity.Create's two-overload fold makes appending onLoaded
  // ambiguous — a shared builder is the robust single-source.) Both forms
  // therefore produce registry-identical entities.
  function meshSpec(parent, meshObject, meshResources, position, rotation, a6, a7, a8) {
    var scale = null, isSize = false, id = null;
    if (a6 && typeof a6 === 'object') { scale = a6; isSize = !!a7; id = a8; }
    else { id = a6; }
    return {
      kind: 'mesh', parentId: parentId(parent), position: position, rotation: rotation,
      scale: scale, isSize: isSize, id: orNullId(id), meshObject: meshObject,
      meshResources: meshResources
    };
  }
  function primSpec(vemlKind, parent, color, position, rotation, id) {
    return {
      kind: vemlKind, parentId: parentId(parent), color: color, position: position,
      rotation: rotation, id: orNullId(id)
    };
  }
  function containerSpec(parent, position, rotation, scale, isSize, tag, id) {
    return {
      kind: 'container', parentId: parentId(parent), position: position, rotation: rotation,
      scale: scale, isSize: !!isSize, tag: orNullId(tag), id: orNullId(id)
    };
  }
  function lightSpec(parent, position, rotation, id, tag) {
    return {
      kind: 'light', parentId: parentId(parent), position: position, rotation: rotation,
      id: orNullId(id), tag: orNullId(tag)
    };
  }

  // ---- MeshEntity (glb Create + the 11 primitive statics) ----
  function MeshEntity(id) { BaseEntity.call(this, id); }
  MeshEntity.prototype = Object.create(BaseEntity.prototype);
  MeshEntity.prototype.constructor = MeshEntity;
  // Create(parent, meshObject, meshResources, position, rotation[, scale, isSize], id?, onLoaded?)
  // — two legacy API overloads folded: if arg6 is an object it is scale (long form),
  // else it is id (short form).
  MeshEntity.Create = function (parent, meshObject, meshResources, position, rotation, a6, a7, a8, a9) {
    // two legacy API overloads folded: if arg6 is an object it is scale (long form,
    // onLoaded=a9), else it is id (short form, onLoaded=a7).
    var onLoaded = (a6 && typeof a6 === 'object') ? a9 : a7;
    return doCreate(meshSpec(parent, meshObject, meshResources, position, rotation, a6, a7, a8), onLoaded);
  };
  function primFactory(vemlKind) {
    return function (parent, color, position, rotation, id, onLoaded) {
      return doCreate(primSpec(vemlKind, parent, color, position, rotation, id), onLoaded);
    };
  }
  MeshEntity.CreateCube = primFactory('cubemesh');
  MeshEntity.CreateSphere = primFactory('spheremesh');
  MeshEntity.CreateCapsule = primFactory('capsulemesh');
  MeshEntity.CreateCylinder = primFactory('cylindermesh');
  MeshEntity.CreatePlane = primFactory('planemesh');
  MeshEntity.CreateTorus = primFactory('torusmesh');
  MeshEntity.CreateCone = primFactory('conemesh');
  MeshEntity.CreateRectangularPyramid = primFactory('rectangularpyramidmesh');
  MeshEntity.CreateTetrahedron = primFactory('tetrahedronmesh');
  MeshEntity.CreatePrism = primFactory('prismmesh');
  MeshEntity.CreateArch = primFactory('archmesh');

  // ---- ContainerEntity ----
  function ContainerEntity(id) { BaseEntity.call(this, id); }
  ContainerEntity.prototype = Object.create(BaseEntity.prototype);
  ContainerEntity.prototype.constructor = ContainerEntity;
  ContainerEntity.Create = function (parent, position, rotation, scale, isSize, tag, id, onLoaded) {
    return doCreate(containerSpec(parent, position, rotation, scale, isSize, tag, id), onLoaded);
  };

  // ---- LightEntity (NOTE: id BEFORE tag, as in the legacy API) ----
  function LightEntity(id) { BaseEntity.call(this, id); }
  LightEntity.prototype = Object.create(BaseEntity.prototype);
  LightEntity.prototype.constructor = LightEntity;
  LightEntity.Create = function (parent, position, rotation, id, tag, onLoaded) {
    return doCreate(lightSpec(parent, position, rotation, id, tag), onLoaded);
  };

  // ---- The v4-native PROMISE-returning factory forms ----
  // Each *Async mirrors its sync sibling's spec but returns a Promise that
  // resolves to the loaded handle (createAsync above). The sync forms are
  // UNCHANGED (additive-not-replacement). The async forms drop the trailing
  // onLoaded arg — the promise IS the onLoaded.
  MeshEntity.CreateAsync = function (parent, meshObject, meshResources, position, rotation, a6, a7, a8) {
    return createAsync(meshSpec(parent, meshObject, meshResources, position, rotation, a6, a7, a8));
  };
  function primFactoryAsync(vemlKind) {
    return function (parent, color, position, rotation, id) {
      return createAsync(primSpec(vemlKind, parent, color, position, rotation, id));
    };
  }
  MeshEntity.CreateCubeAsync = primFactoryAsync('cubemesh');
  MeshEntity.CreateSphereAsync = primFactoryAsync('spheremesh');
  MeshEntity.CreateCapsuleAsync = primFactoryAsync('capsulemesh');
  MeshEntity.CreateCylinderAsync = primFactoryAsync('cylindermesh');
  MeshEntity.CreatePlaneAsync = primFactoryAsync('planemesh');
  MeshEntity.CreateTorusAsync = primFactoryAsync('torusmesh');
  MeshEntity.CreateConeAsync = primFactoryAsync('conemesh');
  MeshEntity.CreateRectangularPyramidAsync = primFactoryAsync('rectangularpyramidmesh');
  MeshEntity.CreateTetrahedronAsync = primFactoryAsync('tetrahedronmesh');
  MeshEntity.CreatePrismAsync = primFactoryAsync('prismmesh');
  MeshEntity.CreateArchAsync = primFactoryAsync('archmesh');
  ContainerEntity.CreateAsync = function (parent, position, rotation, scale, isSize, tag, id) {
    return createAsync(containerSpec(parent, position, rotation, scale, isSize, tag, id));
  };
  LightEntity.CreateAsync = function (parent, position, rotation, id, tag) {
    return createAsync(lightSpec(parent, position, rotation, id, tag));
  };

  // ==================== The remaining entity factories ====================
  // Character (KINEMATIC — SetPosition-driven; Move/Jump are kinematic, above) +
  // the world-space UI factories (Canvas/Button/Text/Image/Input), each wrapping
  // the SAME uiEntity builders the VEML path uses → registry-identical. All
  // ride the SAME doCreate/createAsync hollow-handle + deferred-onLoaded + onError
  // mechanism. Handle-as-id: only ids + plain data cross.

  // CharacterEntity.Create folds the legacy API's two overloads: short form
  // (parent, position, rotation, scale, isSize, tag, id, onLoaded) — the common
  // null-mesh call — and the long form (parent, meshObject, meshResources,
  // meshOffset, meshRotation, avatarLabelOffset, position, rotation, scale, isSize,
  // tag, id, onLoaded). Disambiguated by arg2: a STRING → the mesh (long) form.
  function characterSpec(args) {
    var a = args;
    var spec = { kind: 'character', parentId: parentId(a[0]) };
    if (typeof a[1] === 'string') {
      // long (mesh) form
      spec.meshObject = a[1];
      spec.meshResources = a[2];
      spec.meshOffset = a[3]; spec.meshRotation = a[4]; spec.labelOffset = a[5];
      spec.position = a[6]; spec.rotation = a[7]; spec.scale = a[8];
      spec.isSize = !!a[9]; spec.tag = orNullId(a[10]); spec.id = orNullId(a[11]);
    } else {
      // short form (default-body kinematic character)
      spec.position = a[1]; spec.rotation = a[2]; spec.scale = a[3];
      spec.isSize = !!a[4]; spec.tag = orNullId(a[5]); spec.id = orNullId(a[6]);
    }
    return spec;
  }
  function characterOnLoaded(args) {
    return (typeof args[1] === 'string') ? args[12] : args[7];
  }
  function CharacterEntity(id) { BaseEntity.call(this, id); }
  CharacterEntity.prototype = Object.create(BaseEntity.prototype);
  CharacterEntity.prototype.constructor = CharacterEntity;
  CharacterEntity.Create = function () {
    return doCreate(characterSpec(arguments), characterOnLoaded(arguments));
  };
  CharacterEntity.CreateAsync = function () {
    return createAsync(characterSpec(arguments));
  };

  // ---- Canvas / Button / Text / Image / Input specs (world-space UI) ----
  function canvasSpec(parent, position, rotation, scale, isSize, id, tag) {
    return {
      kind: 'canvas', parentId: parentId(parent), position: position, rotation: rotation,
      scale: scale, isSize: !!isSize, id: orNullId(id), tag: orNullId(tag)
    };
  }
  function buttonSpec(parent, onClick, positionPercent, sizePercent, id, tag) {
    return {
      kind: 'button', parentId: parentId(parent),
      onClick: (onClick == null ? null : String(onClick)),
      positionPercent: positionPercent, sizePercent: sizePercent,
      id: orNullId(id), tag: orNullId(tag)
    };
  }
  function textSpec(parent, text, fontSize, positionPercent, sizePercent, id, tag) {
    return {
      kind: 'text', parentId: parentId(parent),
      text: (text == null ? null : String(text)),
      fontSize: (typeof fontSize === 'number' ? fontSize : undefined),
      positionPercent: positionPercent, sizePercent: sizePercent,
      id: orNullId(id), tag: orNullId(tag)
    };
  }
  function imageSpec(parent, imageFile, positionPercent, sizePercent, id, tag) {
    return {
      kind: 'image', parentId: parentId(parent),
      imageFile: (imageFile == null ? null : String(imageFile)),
      positionPercent: positionPercent, sizePercent: sizePercent,
      id: orNullId(id), tag: orNullId(tag)
    };
  }
  function inputSpec(parent, positionPercent, sizePercent, id, tag) {
    return {
      kind: 'input', parentId: parentId(parent),
      positionPercent: positionPercent, sizePercent: sizePercent,
      id: orNullId(id), tag: orNullId(tag)
    };
  }

  // ---- CanvasEntity (id BEFORE tag) ----
  function CanvasEntity(id) { BaseEntity.call(this, id); }
  CanvasEntity.prototype = Object.create(BaseEntity.prototype);
  CanvasEntity.prototype.constructor = CanvasEntity;
  CanvasEntity.Create = function (parent, position, rotation, scale, isSize, id, tag, onLoaded) {
    return doCreate(canvasSpec(parent, position, rotation, scale, isSize, id, tag), onLoaded);
  };
  CanvasEntity.CreateAsync = function (parent, position, rotation, scale, isSize, id, tag) {
    return createAsync(canvasSpec(parent, position, rotation, scale, isSize, id, tag));
  };

  // ---- ButtonEntity ----
  function ButtonEntity(id) { BaseEntity.call(this, id); }
  ButtonEntity.prototype = Object.create(BaseEntity.prototype);
  ButtonEntity.prototype.constructor = ButtonEntity;
  ButtonEntity.Create = function (parent, onClick, positionPercent, sizePercent, id, tag, onLoaded) {
    return doCreate(buttonSpec(parent, onClick, positionPercent, sizePercent, id, tag), onLoaded);
  };
  ButtonEntity.CreateAsync = function (parent, onClick, positionPercent, sizePercent, id, tag) {
    return createAsync(buttonSpec(parent, onClick, positionPercent, sizePercent, id, tag));
  };

  // ---- TextEntity (SetText/GetText live glyph content) ----
  function TextEntity(id) { BaseEntity.call(this, id); }
  TextEntity.prototype = Object.create(BaseEntity.prototype);
  TextEntity.prototype.constructor = TextEntity;
  TextEntity.Create = function (parent, text, fontSize, positionPercent, sizePercent, id, tag, onLoaded) {
    return doCreate(textSpec(parent, text, fontSize, positionPercent, sizePercent, id, tag), onLoaded);
  };
  TextEntity.CreateAsync = function (parent, text, fontSize, positionPercent, sizePercent, id, tag) {
    return createAsync(textSpec(parent, text, fontSize, positionPercent, sizePercent, id, tag));
  };

  // ---- ImageEntity ----
  function ImageEntity(id) { BaseEntity.call(this, id); }
  ImageEntity.prototype = Object.create(BaseEntity.prototype);
  ImageEntity.prototype.constructor = ImageEntity;
  ImageEntity.Create = function (parent, imageFile, positionPercent, sizePercent, id, tag, onLoaded) {
    return doCreate(imageSpec(parent, imageFile, positionPercent, sizePercent, id, tag), onLoaded);
  };
  ImageEntity.CreateAsync = function (parent, imageFile, positionPercent, sizePercent, id, tag) {
    return createAsync(imageSpec(parent, imageFile, positionPercent, sizePercent, id, tag));
  };

  // ---- InputEntity — DEGRADES to a text-field-shaped plane
  // (v4 has no world-space keyboard-capture widget). SetText/GetText work. ----
  function InputEntity(id) { BaseEntity.call(this, id); }
  InputEntity.prototype = Object.create(BaseEntity.prototype);
  InputEntity.prototype.constructor = InputEntity;
  InputEntity.Create = function (parent, positionPercent, sizePercent, id, tag, onLoaded) {
    return doCreate(inputSpec(parent, positionPercent, sizePercent, id, tag), onLoaded);
  };
  InputEntity.CreateAsync = function (parent, positionPercent, sizePercent, id, tag) {
    return createAsync(inputSpec(parent, positionPercent, sizePercent, id, tag));
  };

  // ---- Entity lookup ----
  var Entity = {
    Get: function (id) { var s = G.__entityGet(String(id)); return s ? wrapEntity(s) : null; },
    GetByTag: function (tag) { var s = G.__entityGetByTag(String(tag)); return s ? wrapEntity(s) : null; },
    // v4 additive (not in the legacy API): all live entities as handles.
    GetAllEntities: function () {
      var ids = G.__entityGetAll(); var out = [];
      if (ids && ids.length) { for (var i = 0; i < ids.length; i++) out.push(wrapEntity(ids[i])); }
      return out;
    }
  };

  // ==================== World (host-bridged) ====================
  var World = {
    // GetQueryParam EXCLUDES reserved names (the host returns null for them):
    // a world never sees world-url/spawn/log/debug/limits.
    GetQueryParam: function (key) {
      // Host null marshals to undefined across the boundary — normalize to null
      // (a reserved/absent param returns null, not undefined).
      var v = G.__worldGetQueryParam(String(key));
      return v === undefined ? null : v;
    },
    // LoadWorld/LoadWebPage route through the SAME NavigationController the
    // portals use (script nav == portal nav == hash nav).
    LoadWorld: function (url) { G.__worldLoadWorld(String(url)); },
    LoadWebPage: function (url) { G.__worldLoadWebPage(String(url)); },
    GetWorldLoadState: function () { return G.__worldGetLoadState(); }
  };

  // ==================== Camera (host-bridged) ====================
  // Drives the browser-owned first-person controller (v4 has no CharacterEntity
  // player — degrade-tier). SetPosition = the teleport idiom; SetRotation feeds
  // yaw/pitch back.
  var Camera = {
    GetPosition: function (local) {
      var p = G.__cameraGetPosition(!!local); return p ? new Vector3(p.x, p.y, p.z) : null;
    },
    SetPosition: function (position, local) { return G.__cameraSetPosition(position, !!local); },
    GetRotation: function (local) {
      var r = G.__cameraGetRotation(!!local); return r ? new Quaternion(r.x, r.y, r.z, r.w) : null;
    },
    SetRotation: function (rotation, local) { return G.__cameraSetRotation(rotation, !!local); },
    // The CAMERA FOLLOWER family (handle-as-id: only the entity's
    // id crosses). AttachToEntity(entity[, offset]) PARENTS the camera to the
    // entity (camera-follows-entity); AttachToEntity(null) DETACHES + restores
    // free-look. offset is a v4-additive local Vector3 (the legacy AttachToEntity
    // takes none — scripts reach it via Camera.SetPosition after PlaceCameraOn).
    // AddCameraFollower(entity)/RemoveCameraFollower(entity) are the REVERSE
    // direction (the ENTITY follows the camera each frame).
    AttachToEntity: function (entity, offset) {
      return G.__cameraAttachToEntity(entity == null ? null : String(entity._id), offset);
    },
    AddCameraFollower: function (entity) {
      return entity == null ? false : G.__cameraAddFollower(String(entity._id));
    },
    RemoveCameraFollower: function (entity) {
      return entity == null ? false : G.__cameraRemoveFollower(String(entity._id));
    }
  };

  // ==================== Environment (host-bridged, WORLD-level) ====================
  // Drives the EXISTING v4 sky subsystem at runtime (the SAME
  // applyEnvironment/dispatchBackground a VEML <background> uses). WORLD-LEVEL
  // (no entity id — keyed to the active world's environment). SetSkyTexture →
  // panorama PhotoDome (fire-and-forget, like the legacy void SetSkyTexture);
  // SetSolidColorSky → clear-color + neutral IBL. SetSky is the sky profile's
  // procedural sky, SetEnvironmentMap the environment profile's image-based
  // light: the two looks VEML 4.0 defines, with the profiles' own attribute
  // names. The legacy class's other members (lite day/night sky, fog, world
  // offset) have no 4.0 definition and are not here.
  var Environment = {
    SetSkyTexture: function (url) { return G.__environmentSetSkyTexture(String(url)); },
    SetSolidColorSky: function (color) { return G.__environmentSetSolidColorSky(color); },
    SetSky: function (options) { return G.__environmentSetSky(options !== null && typeof options === 'object' ? options : {}); },
    SetEnvironmentMap: function (src, options) {
      return G.__environmentSetEnvironmentMap(String(src), options !== null && typeof options === 'object' ? options : {});
    }
  };

  // ==================== Input (host-bridged, POLLING) ====================
  // The continuous-input POLLING surface (the continuous move/look
  // INPUTEVENTS ride the scriptInputDispatcher host-pump, NOT here). Each member
  // crosses the boundary as PLAIN DATA and is re-wrapped SANDBOX-SIDE as a WorldTypes
  // Vector2/Vector3 (the value types stay sandbox-side). Handle-as-id: GetPointerRaycast's
  // hit entity crosses as an ID string, re-wrapped as a BaseEntity handle here.
  var Input = {
    // GetMoveValue()->Vector2 (moveValue: x=strafe, y=forward).
    GetMoveValue: function () {
      var v = G.__inputGetMoveValue();
      return v ? new Vector2(v.x, v.y) : new Vector2(0, 0);
    },
    // GetLookValue()->Vector2 (lookValue delta: x=yaw px, y=pitch px).
    GetLookValue: function () {
      var v = G.__inputGetLookValue();
      return v ? new Vector2(v.x, v.y) : new Vector2(0, 0);
    },
    // GetKeyValue(key)->bool (pressedKeys.has — key is a KeyboardEvent.key string).
    GetKeyValue: function (key) {
      return G.__inputGetKeyValue(key == null ? '' : String(key)) === true;
    },
    // GetPointerRaycast(direction?, pointerIndex?)->{entity,hitPoint,hitPointNormal,origin}|null.
    // v4 has ONE pointer (the crosshair) — the args are accepted-but-IGNORED.
    // Handle-as-id: entity is re-wrapped as a BaseEntity handle here.
    GetPointerRaycast: function () {
      var h = G.__inputGetPointerRaycast();
      if (!h || h.entity == null) return null;
      return {
        entity: wrapEntity(h.entity),
        hitPoint: new Vector3(h.hitPoint.x, h.hitPoint.y, h.hitPoint.z),
        hitPointNormal: new Vector3(h.hitPointNormal.x, h.hitPointNormal.y, h.hitPointNormal.z),
        origin: new Vector3(h.origin.x, h.origin.y, h.origin.z)
      };
    },
    // The RIG FOLLOWER seam: the ENTITY follows the rig origin (the
    // controller feet + yaw) each frame. Handle-as-
    // id (only the entity's id crosses). RemoveRigFollower returns control.
    AddRigFollower: function (entity) {
      return entity == null ? false : G.__inputAddRigFollower(String(entity._id));
    },
    RemoveRigFollower: function (entity) {
      return entity == null ? false : G.__inputRemoveRigFollower(String(entity._id));
    }
  };
  // IsVR is a PROPERTY (no parens — scripts read \`Input.IsVR\`/\`!Input.IsVR\`).
  defGetter(Input, 'IsVR', function () { return G.__inputIsVR() === true; });

  // ==================== LightType enum ====================
  // Legacy API: enum LightType { Directional, Spot, Point } (ordinals 0,1,2). v4
  // exposes STRING values (the host resolves them own-property-safe). Frozen +
  // non-writable so a world cannot mutate the shared enum.
  var LightType = Object.freeze({ Directional: 'directional', Spot: 'spot', Point: 'point' });

  // ==================== InteractionState enum ====================
  // Legacy API: enum InteractionState { Hidden, Static, Physical, Placing }. v4
  // exposes STRING values; the host maps them (Hidden↔visibility, Static real,
  // Physical a dynamic body, Placing a kinematic one — the engine loads on the first ask).
  var InteractionState = Object.freeze({ Hidden: 'hidden', Static: 'static', Physical: 'physical', Placing: 'placing' });

  // ---- Publish the API globals ----
  G.Vector3 = Vector3; G.Vector2 = Vector2; G.Vector4 = Vector4;
  G.Quaternion = Quaternion; G.Color = Color; G.UUID = UUID;
  G.EntityPhysicalProperties = EntityPhysicalProperties;
  G.Logging = Logging; G.Time = Time; G.Context = Context;
  G.WorldStorage = WorldStorage; G.LocalStorage = LocalStorage;
  G.console = consoleObj; // v4-native console → the one runtime log surface
  G.BaseEntity = BaseEntity; G.MeshEntity = MeshEntity;
  G.ContainerEntity = ContainerEntity; G.LightEntity = LightEntity;
  // The remaining entity factories (character + world-space UI).
  G.CharacterEntity = CharacterEntity; G.CanvasEntity = CanvasEntity;
  G.ButtonEntity = ButtonEntity; G.TextEntity = TextEntity;
  G.ImageEntity = ImageEntity; G.InputEntity = InputEntity;
  G.Entity = Entity; G.World = World; G.Camera = Camera;
  // The client-hints profile's script surface (profiles/client-hints.md).
  var ClientHints = {
    // null for a name the shell does not implement (the host's null crosses as undefined).
    Get: function (name) { var v = G.__hintsGet(String(name)); return v == null ? null : String(v); },
    Set: function (name, value) { return G.__hintsSet(String(name), String(value)) === true; }
  };
  var Chat = {
    Post: function (text) { return G.__chatPost(text == null ? '' : String(text)) === true; },
    // OnMessage(callback) — a function or a function's NAME (the __cb registry).
    OnMessage: function (callback) {
      var cbId = (callback === undefined || callback === null) ? 0 : G.__cb.store(callback);
      if (cbId === 0) return false;
      return G.__chatOnMessage(cbId) === true;
    }
  };
  // Dock: a tool in the shell's bar and Build menu. AddTool(name, picture, callback) answers the
  // tool's id, or null where the shell refuses; the callback is a function or a function's NAME.
  var Dock = {
    AddTool: function (name, picture, callback) {
      var cbId = (callback === undefined || callback === null) ? 0 : G.__cb.store(callback);
      if (cbId === 0) return null;
      var id = G.__dockAdd(name == null ? '' : String(name), picture == null ? null : String(picture), cbId);
      if (id == null) { G.__cb.release(cbId); return null; }
      return String(id);
    },
    RemoveTool: function (id) { return G.__dockRemove(id == null ? '' : String(id)) === true; },
    ClearTools: function () { G.__dockClear(); }
  };
  G.ClientHints = ClientHints; G.Chat = Chat; G.Dock = Dock;

  // ==================== world.actions (VEML 4.0 §8.1/§8.3) ====================
  // The action bus's script surface: world.actions.on(name, handler) and
  // world.actions.fire(name, data). Handlers stay here, keyed by name, behind
  // ONE persistent registry callback the host resumes with [name, data] on the
  // next tick — so a fire (from an input binding, an on-load, an embedded page,
  // or this script) is delivered the same way whoever fired it. The veml.*
  // names are the client's: a script may fire them, and the host ignores it.
  var actionHandlers = Object.create(null);
  var actions = {
    on: function (name, handler) {
      name = String(name);
      if (typeof handler !== 'function') return function () {};
      var list = actionHandlers[name];
      if (!list) { list = actionHandlers[name] = []; G.__actionsOn(name); }
      list.push(handler);
      return function () {
        var current = actionHandlers[name];
        if (!current) return;
        var i = current.indexOf(handler);
        if (i !== -1) current.splice(i, 1);
        if (current.length === 0) { delete actionHandlers[name]; G.__actionsOff(name); }
      };
    },
    fire: function (name, data) {
      return G.__actionsFire(String(name), data === undefined ? null : data) === true;
    }
  };
  var deliverActionCbId = G.__cb.store(function (name, data) {
    var list = actionHandlers[name];
    if (!list) return;
    var snapshot = list.slice();
    for (var i = 0; i < snapshot.length; i++) {
      try { snapshot[i](data); } catch (e) { consoleObj.error('action handler for ' + name + ' threw:', e && e.message ? e.message : String(e)); }
    }
  });
  G.__actionsInit(deliverActionCbId);
  var world = { actions: actions };
  G.world = world;

  G.Environment = Environment; G.LightType = LightType; G.InteractionState = InteractionState;
  // The Input polling global.
  G.Input = Input;
})();
`,o=`webverse:ls:`;function s(e,t){switch(typeof e){case`number`:case`string`:case`boolean`:return e;case`bigint`:return e>=BigInt(-(2**53-1))&&e<=BigInt(2**53-1)?Number(e):String(e);case`symbol`:case`function`:case`undefined`:return;case`object`:{if(e===null||t.has(e))return null;if(t.add(e),Array.isArray(e)){let n=[];for(let r of e){let e=s(r,t);n.push(e===void 0?null:e)}return n}let n={};for(let r of Object.keys(e)){if(r===`__proto__`)continue;let i=s(e[r],t);i!==void 0&&(n[r]=i)}return n}default:return}}var c=1e3,l=100,ee=67108864,te=1048576,u=1e3,d=1e3,f=4096;function p(e,t={}){let n=t.scriptBudgetMs??c,r=t.tickCallbackBudgetMs??l,p=t.now??Date.now,h=t.memoryLimitBytes??ee,g=t.maxStackSizeBytes??te,_=new Map,v=t.localStorage,y=t.uuid??(()=>{let e=typeof globalThis<`u`?globalThis.crypto:void 0;return typeof e?.randomUUID==`function`?e.randomUUID():`00000000-0000-0000-0000-000000000000`}),b=e.newRuntime();h>0&&b.setMemoryLimit(h),g>0&&b.setMaxStackSize(g);let x=b.newContext(),S=!1,C=new Map,w=[],T=!1,E=[],ne=1,D=[],O=e=>{let t=p()+e;b.setInterruptHandler(()=>p()>t)};{b.setInterruptHandler(()=>!1);let e=x.evalCode(i,`callback-registry.js`);if(e.error){let t=x.dump(e.error);throw e.error.dispose(),b.setInterruptHandler(()=>!1),x.dispose(),b.dispose(),Error(`[sandbox] callback-registry bootstrap failed: ${String(t)}`)}e.value.dispose()}let k=x.getProp(x.global,`JSON`),A=x.getProp(k,`parse`),j=x.getProp(x.global,`__cb`),M=x.getProp(j,`resume`),N=x.getProp(j,`release`);D.push(k,A,j,M,N);let P=e=>{if(e==null)return x.undefined;switch(typeof e){case`number`:return x.newNumber(e);case`string`:return x.newString(e);case`boolean`:return e?x.true:x.false;default:{let t;try{t=JSON.stringify(e)}catch{return x.undefined}if(t===void 0)return x.undefined;let n=x.newString(t),r=x.callFunction(A,k,n);return n.dispose(),r.error?(r.error.dispose(),x.undefined):r.value}}},F=e=>e===x.undefined||e===x.null||e===x.true||e===x.false,I=(e,t)=>{if(S)return null;O(r);let n=x.newNumber(e),i=x.newString(t),a=x.callFunction(M,j,n,i);if(n.dispose(),i.dispose(),a.error){let t=m(x,a.error,`callback#${e}`);return a.error.dispose(),t}return a.value.dispose(),null},L=e=>{if(S)return;O(r);let t=x.newNumber(e),n=x.callFunction(N,j,t);t.dispose(),n.error?n.error.dispose():n.value.dispose()},R=e=>{e&&t.onLog&&t.onLog(`[error] ${e.source}: ${e.message}`)},z=(e,t)=>{if(S)return;let n=x.newFunction(e,(...e)=>{let n=e.map(e=>{try{let t=s(x.dump(e),new WeakSet);return t===void 0?null:t}catch{return null}}),r;try{r=t(...n)}catch(e){let t=e instanceof Error?e.message:String(e);return{error:x.newError(t)}}let i=s(r,new WeakSet);return P(i===void 0?null:i)});x.setProp(x.global,e,n),n.dispose()};z(`__log`,(e,n)=>{let r=String(n??``),i=e===`debug`||e===`warning`||e===`error`?e:`default`;t.logSink?.(i,r),t.onLog?.(r)}),z(`__uuid`,()=>y()),z(`__worldStorageSet`,(e,t)=>{_.set(String(e),t==null?null:String(t))}),z(`__worldStorageGet`,e=>{let t=String(e);return _.has(t)?_.get(t)??null:null}),z(`__localStorageSet`,(e,t)=>{v?.setItem(o+String(e),t==null?``:String(t))}),z(`__localStorageGet`,e=>v?.getItem(o+String(e))??null),z(`__localStorageRemove`,e=>{v?.removeItem(o+String(e))});let B=t.entityApi,V=e=>e===!0,H=e=>{let t=e&&typeof e==`object`?e:{};return{x:typeof t.x==`number`?t.x:0,y:typeof t.y==`number`?t.y:0,z:typeof t.z==`number`?t.z:0}},U=e=>{let t=e&&typeof e==`object`?e:{};return{x:typeof t.x==`number`?t.x:0,y:typeof t.y==`number`?t.y:0,z:typeof t.z==`number`?t.z:0,w:typeof t.w==`number`?t.w:1}},W=e=>{let t=e&&typeof e==`object`?e:{};return{r:typeof t.r==`number`?t.r:.5,g:typeof t.g==`number`?t.g:.5,b:typeof t.b==`number`?t.b:.5,a:typeof t.a==`number`?t.a:1}},G=e=>{let t=e&&typeof e==`object`?e:{},n={};return t.color&&typeof t.color==`object`&&(n.color=W(t.color)),typeof t.intensity==`number`&&(n.intensity=t.intensity),typeof t.range==`number`&&(n.range=t.range),typeof t.innerSpotAngle==`number`&&(n.innerSpotAngle=t.innerSpotAngle),typeof t.outerSpotAngle==`number`&&(n.outerSpotAngle=t.outerSpotAngle),typeof t.temperature==`number`&&(n.temperature=t.temperature),n},re=e=>{let t=e&&typeof e==`object`?e:{},n={};for(let e of[`zenith`,`horizon`,`groundColor`,`sunColor`])t[e]&&typeof t[e]==`object`&&(n[e]=W(t[e]));for(let e of[`blend`,`groundHeight`,`groundFade`,`sunDiameter`,`sunElevation`,`sunAzimuth`])typeof t[e]==`number`&&(n[e]=t[e]);for(let e of[`groundEnabled`,`sunEnabled`])typeof t[e]==`boolean`&&(n[e]=t[e]);return n},ie=e=>{let t=e&&typeof e==`object`?e:{},n={};for(let e of[`intensity`,`diffuse`,`specular`,`glazingBoost`,`glazingF0`])typeof t[e]==`number`&&(n[e]=t[e]);return(t.punctualLights===`keep`||t.punctualLights===`exclude`)&&(n.punctualLights=t.punctualLights),n},ae=e=>{let t=e&&typeof e==`object`?e:{},n={};return typeof t.angularDrag==`number`&&(n.angularDrag=t.angularDrag),typeof t.drag==`number`&&(n.drag=t.drag),typeof t.mass==`number`&&(n.mass=t.mass),typeof t.gravitational==`boolean`&&(n.gravitational=t.gravitational),t.centerOfMass&&typeof t.centerOfMass==`object`&&(n.centerOfMass=H(t.centerOfMass)),n};z(`__entityCreate`,(e,t,n)=>{if(!B||!e||typeof e!=`object`)return null;let r=typeof t==`number`&&t>0?()=>$(t,[],!0):void 0,i=typeof n==`number`&&n>0?e=>$(n,[String(e??`entity load failed`)],!0):void 0;return B.createEntity(e,r,i)}),z(`__entityGet`,e=>B?.get(String(e))??null),z(`__entityGetByTag`,e=>B?.getByTag(String(e))??null),z(`__entityGetAll`,()=>B?.getAll()??[]),z(`__entityGetTag`,e=>B?.getTag(String(e))??null),z(`__entityGetPosition`,(e,t)=>B?.getPosition(String(e),V(t))??null),z(`__entitySetPosition`,(e,t,n)=>B?.setPosition(String(e),H(t),V(n))??!1),z(`__entityGetRotation`,(e,t)=>B?.getRotation(String(e),V(t))??null),z(`__entitySetRotation`,(e,t,n)=>B?.setRotation(String(e),U(t),V(n))??!1),z(`__entityGetScale`,e=>B?.getScale(String(e))??null),z(`__entitySetScale`,(e,t)=>B?.setScale(String(e),H(t))??!1),z(`__entityGetTransform`,e=>B?.getTransform(String(e))??null),z(`__entityGetSize`,e=>B?.getSize(String(e))??null),z(`__entitySetSize`,(e,t)=>B?.setSize(String(e),H(t))??!1),z(`__entityGetEulerRotation`,(e,t)=>B?.getEulerRotation(String(e),V(t))??null),z(`__entitySetEulerRotation`,(e,t,n)=>B?.setEulerRotation(String(e),H(t),V(n))??!1),z(`__entityGetParent`,e=>B?.getParent(String(e))??null),z(`__entitySetParent`,(e,t)=>B?.setParent(String(e),t==null?null:String(t))??!1),z(`__entityGetChildren`,e=>B?.getChildren(String(e))??[]),z(`__entityGetVisibility`,e=>B?.getVisibility(String(e))??!1),z(`__entitySetVisibility`,(e,t)=>B?.setVisibility(String(e),V(t))??!1),z(`__entityGetHighlight`,e=>B?.getHighlight(String(e))??!1),z(`__entitySetHighlight`,(e,t)=>B?.setHighlight(String(e),V(t))??!1),z(`__entityDelete`,e=>B?.delete(String(e))??!1),z(`__entityCompare`,(e,t)=>B?.compare(String(e),String(t))??!1),z(`__worldGetQueryParam`,e=>B?.worldGetQueryParam(String(e))??null),z(`__worldLoadWorld`,e=>{B?.worldLoadWorld(String(e))}),z(`__worldLoadWebPage`,e=>{B?.worldLoadWebPage(String(e))}),z(`__worldGetLoadState`,()=>B?.worldGetLoadState()??`unloaded`),z(`__cameraGetPosition`,e=>B?.cameraGetPosition(V(e))??null),z(`__cameraSetPosition`,(e,t)=>B?.cameraSetPosition(H(e),V(t))??!1),z(`__cameraGetRotation`,e=>B?.cameraGetRotation(V(e))??null),z(`__cameraSetRotation`,(e,t)=>B?.cameraSetRotation(U(e),V(t))??!1),z(`__environmentSetSkyTexture`,e=>B?.environmentSetSkyTexture(String(e))??!1),z(`__environmentSetSolidColorSky`,e=>B?.environmentSetSolidColorSky(W(e))??!1),z(`__environmentSetSky`,e=>B?.environmentSetSky(re(e))??!1),z(`__environmentSetEnvironmentMap`,(e,t)=>B?.environmentSetEnvironmentMap(String(e),ie(t))??!1),z(`__lightSetType`,(e,t)=>B?.lightSetType(String(e),String(t))??!1),z(`__lightSetProperties`,(e,t)=>B?.lightSetProperties(String(e),G(t))??!1),z(`__entitySetInteractionState`,(e,t)=>B?.entitySetInteractionState(String(e),String(t))??!1),z(`__entityGetInteractionState`,e=>B?.entityGetInteractionState(String(e))??null),z(`__entitySetText`,(e,t)=>B?.entitySetText(String(e),String(t??``))??!1),z(`__entityGetText`,e=>B?.entityGetText(String(e))??null),z(`__canvasMakeScreen`,e=>B?.canvasMakeScreenCanvas(String(e))??!1),z(`__canvasMakeWorld`,e=>B?.canvasMakeWorldCanvas(String(e))??!1),z(`__canvasIsScreen`,e=>B?.canvasIsScreenCanvas(String(e))??!1),z(`__inputGetMoveValue`,()=>B?.inputGetMoveValue()??{x:0,y:0}),z(`__inputGetLookValue`,()=>B?.inputGetLookValue()??{x:0,y:0}),z(`__inputGetKeyValue`,e=>B?.inputGetKeyValue(String(e))??!1),z(`__inputGetPointerRaycast`,()=>B?.inputGetPointerRaycast()??null),z(`__inputIsVR`,()=>B?.inputIsVR()??!1),z(`__cameraAttachToEntity`,(e,t)=>B?.cameraAttachToEntity(e==null?null:String(e),t==null?void 0:H(t))??!1),z(`__cameraAddFollower`,e=>B?.cameraAddFollower(String(e))??!1),z(`__cameraRemoveFollower`,e=>B?.cameraRemoveFollower(String(e))??!1),z(`__entityPlaceCameraOn`,e=>B?.entityPlaceCameraOn(String(e))??!1),z(`__inputAddRigFollower`,e=>B?.inputAddRigFollower(String(e))??!1),z(`__inputRemoveRigFollower`,e=>B?.inputRemoveRigFollower(String(e))??!1),z(`__characterMove`,(e,t)=>B?.characterMove(String(e),H(t))??!1),z(`__characterJump`,(e,t,n)=>B?.characterJump(String(e),typeof t==`number`?t:NaN,n===void 0||n===!0)??!1),z(`__characterSetPhysicalProperties`,(e,t)=>B?.characterSetPhysicalProperties(String(e),ae(t))??!1),z(`__characterGetPhysicalProperties`,e=>B?.characterGetPhysicalProperties(String(e))??null);let K=t.peopleHost;z(`__hintsGet`,e=>K?.hintsGet(String(e))??null),z(`__hintsSet`,(e,t)=>K?.hintsSet(String(e),String(t))??!1),z(`__chatPost`,e=>K?.chatPost(String(e??``))??!1);let q;z(`__chatOnMessage`,e=>{if(!K||typeof e!=`number`||e<=0)return!1;let t=K.onChat((t,n)=>$(e,[String(t??``),String(n??``)],!1));return q&&(q.off(),q.id!==e&&L(q.id)),q={id:e,off:t},!0});let J=new Map,Y=()=>K?.dock?.();z(`__dockAdd`,(e,t,n)=>{let r=Y();if(!r||typeof n!=`number`||n<=0)return null;let i=r.addTool(String(e??``),t==null?null:String(t),()=>$(n,[],!1));return i===null?null:(J.set(i,n),i)}),z(`__dockRemove`,e=>{let t=String(e??``),n=Y()?.removeTool(t)??!1,r=J.get(t);return r!==void 0&&(J.delete(t),L(r)),n}),z(`__dockClear`,()=>{Y()?.clearTools();for(let e of J.values())L(e);return J.clear(),!0});let X=t.actionsHost;z(`__actionsInit`,e=>!X||typeof e!=`number`||e<=0?!1:(X.init(e),!0)),z(`__actionsOn`,e=>X?.on(String(e))??!1),z(`__actionsOff`,e=>{X?.off(String(e))}),z(`__actionsFire`,(e,t)=>X?.fire(String(e),t??null)??!1),z(`__scheduleTimer`,(e,t,n)=>{if(typeof t!=`number`||t===0)return 0;let r=e===`interval`?`interval`:`timeout`,i=typeof n==`number`&&n>0?n:0,a=ne++;return C.set(a,{cbId:t,kind:r,remainingMs:i,intervalMs:r===`interval`?i:null}),a}),z(`__clearTimer`,e=>{if(typeof e!=`number`)return null;let t=C.get(e);return t&&(C.delete(e),L(t.cbId)),null});{b.setInterruptHandler(()=>!1);let e=x.evalCode(a,`world-api-prelude.js`);if(e.error){let t=x.dump(e.error);throw e.error.dispose(),x.dispose(),b.dispose(),Error(`[sandbox] world-api prelude failed: ${String(t)}`)}e.value.dispose()}let Z=x.getProp(x.global,`__guardAsync`);D.push(Z);let oe=(e,t)=>{if(S)return null;O(n);let r=x.evalCode(e,t);if(r.error){let e=m(x,r.error,t);return r.error.dispose(),e}return r.value.dispose(),null},se=e=>{if(S)return{ok:!1,error:{source:`(disposed)`,message:`sandbox disposed`}};O(n);let t=x.evalCode(e,`(evaluate)`);if(t.error){let e=m(x,t.error,`(evaluate)`);return t.error.dispose(),{ok:!1,error:e}}let r=x.dump(t.value);return t.value.dispose(),{ok:!0,value:r}},Q=(e,t)=>{if(S)return null;O(r);let n=x.evalCode(e,t);if(n.error){let e=m(x,n.error,t);return n.error.dispose(),e}if(Z.alive){let e=x.callFunction(Z,x.undefined,n.value);e.error?e.error.dispose():e.value.dispose()}return n.value.dispose(),null},$=(e,n,r=!0)=>{if(!S){if(w.length>=4096){T||(T=!0,t.onLog?.(`[sandbox] deferred-callback queue at cap (${f}) — dropping excess.`));return}w.push({cbId:e,argsJson:JSON.stringify(n??[]),release:r})}};return{runScript:oe,evaluate:se,dispatch:Q,expose:z,deferResume:$,tick:e=>{if(S)return;let t=typeof e==`number`&&e>0?e:0,n=p();if(w.length>0){let e=w.splice(0,w.length);for(let t of e)R(I(t.cbId,t.argsJson)),t.release&&L(t.cbId)}if(E.length>0){let e=E.splice(0,E.length);for(let t of e){if(S)return;R(Q(t.code,t.label))}}if(C.size>0)for(let[e,n]of[...C]){if(S)return;if(n.remainingMs-=t,n.remainingMs>0)continue;let r=I(n.cbId,`[]`);R(r),n.kind===`timeout`||r?.interrupted?(C.delete(e),L(n.cbId)):(n.remainingMs+=n.intervalMs??0,(n.intervalMs??0)<=0&&(n.remainingMs=1e-4))}if(!S&&b.hasPendingJob()){let e=Math.max(n+r,p()+4),t=u;for(;!S&&t>0&&b.hasPendingJob()&&p()<e;){O(Math.max(4,e-p()));let n=b.executePendingJobs(1);if(n.error){R(m(x,n.error,`(pending-jobs)`)),n.dispose();break}let r=typeof n.value==`number`&&n.value>0?n.value:0;if(n.dispose(),--t,r===0)break}}},dispose:()=>{if(!S){S=!0,C.clear(),w.length=0;try{b.setInterruptHandler(()=>!0);let e=p()+8,t=d;for(;t-->0&&b.alive&&b.hasPendingJob()&&p()<e;)b.executePendingJobs(1).dispose()}catch{}b.alive&&b.setInterruptHandler(()=>!1);for(let e of D)!F(e)&&e.alive&&e.dispose();D.length=0;try{x.alive&&x.dispose()}catch(e){t.onLog?.(`[sandbox] context dispose failed: ${String(e)}`)}try{b.alive&&b.dispose()}catch(e){t.onLog?.(`[sandbox] runtime dispose failed: ${String(e)}`)}}}}}function m(e,t,n){let r=e.dump(t),i=``,a;if(r&&typeof r==`object`){let e=r,t=typeof e.name==`string`?e.name:``;i=typeof e.message==`string`?e.message:String(r),t&&!i.startsWith(t)&&(i=`${t}: ${i}`),a=typeof e.stack==`string`?e.stack:void 0}else i=String(r);let o=/interrupt/i.test(i),s={source:n,message:i||`script error`};return a&&(s.stack=a),o&&(s.interrupted=!0,s.message=`execution interrupted (deadline exceeded)`),s}var h;function g(){return h||=t(r),h}async function _(e){return p(await g(),e)}export{_ as createSandbox};
//# sourceMappingURL=sandboxChunk-COORquJ9.js.map