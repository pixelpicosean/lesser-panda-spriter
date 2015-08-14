/**
 * Spriter plugin for LesserPanda
 * @version 0.0.1
 * @author Sean Bohan (pixelpicosean@gmail.com)
 *
 * Based on Spriter.js by:
 * - Jason Andersen jgandersen@gmail.com
 * - Isaac Burns isaacburns@gmail.com
 */

/**
 * A JavaScript API for the Spriter SCON animation data format.
 */
(function(spriter) { 'use strict';

  /**
   * Stores animation data (scon objects)
   * @type {Object}
   */
  var scons = {};

  spriter.loaderMiddleWare = function(res, next) {
    if (res.url.match(/\.scon$/)) {
      // console.log('%s is scon', res.url);
      var path = res.url.replace(/[^\/]*$/, '');
      var atlasUrl = res.url.replace(/\.scon$/, '.json');
      // console.log(atlasUrl);
      PIXI.loader.add(atlasUrl);

      var scon = JSON.parse(res.data);
      scons[res.name] = new spriter.Data(scon);
    }
    next();
  };

  /**
   * Get the data object of a specific scon file asset key
   * @param  {String} sconKey Key of the scon file
   * @return {spriter.Data}   Data object created for the scon file
   */
  spriter.getData = function(sconKey) {
    return scons[sconKey];
  };

  /**
   * @constructor
   * @param {number=} rad
   */
  spriter.Angle = function(rad) {
    this.rad = rad || 0;
  }

  Object.defineProperty(spriter.Angle.prototype, 'deg', {
    /** @this {spriter.Angle} */
    get: function() {
      return this.rad * 180 / Math.PI;
    },
    /** @this {spriter.Angle} */
    set: function(value) {
      this.rad = value * Math.PI / 180;
    }
  });

  Object.defineProperty(spriter.Angle.prototype, 'cos', {
    /** @this {spriter.Angle} */
    get: function() {
      return Math.cos(this.rad);
    }
  });

  Object.defineProperty(spriter.Angle.prototype, 'sin', {
    /** @this {spriter.Angle} */
    get: function() {
      return Math.sin(this.rad);
    }
  });

  /**
   * @return {spriter.Angle}
   */
  spriter.Angle.prototype.selfIdentity = function() {
    this.rad = 0;
    return this;
  }

  /**
   * @return {spriter.Angle}
   * @param {spriter.Angle} other
   */
  spriter.Angle.prototype.copy = function(other) {
    this.rad = other.rad;
    return this;
  }

  /**
   * @return {spriter.Angle}
   * @param {spriter.Angle} a
   * @param {spriter.Angle} b
   * @param {spriter.Angle=} out
   */
  spriter.Angle.add = function(a, b, out) {
    out = out || new spriter.Angle();
    out.rad = spine.wrapAngleRadians(a.rad + b.rad);
    return out;
  }

  /**
   * @return {spriter.Angle}
   * @param {spriter.Angle} other
   * @param {spriter.Angle=} out
   */
  spriter.Angle.prototype.add = function(other, out) {
    return spriter.Angle.add(this, other, out);
  }

  /**
   * @return {spriter.Angle}
   * @param {spriter.Angle} other
   */
  spriter.Angle.prototype.selfAdd = function(other) {
    return spriter.Angle.add(this, other, this);
  }

  /**
   * @return {spriter.Angle}
   * @param {spriter.Angle} a
   * @param {spriter.Angle} b
   * @param {number} pct
   * @param {number} spin
   * @param {spriter.Angle=} out
   */
  spriter.Angle.tween = function(a, b, pct, spin, out) {
    out = out || new spriter.Angle();
    out.rad = tweenAngleRadians(a.rad, b.rad, pct, spin);
    return out;
  }

  /**
   * @return {spriter.Angle}
   * @param {spriter.Angle} other
   * @param {number} pct
   * @param {number} spin
   * @param {spriter.Angle=} out
   */
  spriter.Angle.prototype.tween = function(other, pct, spin, out) {
    return spriter.Angle.tween(this, other, pct, spin, out);
  }

  /**
   * @return {spriter.Angle}
   * @param {spriter.Angle} other
   * @param {number} pct
   * @param {number} spin
   */
  spriter.Angle.prototype.selfTween = function(other, pct, spin) {
    return spriter.Angle.tween(this, other, pct, spin, this);
  }

  /**
   * @constructor
   * @param {number=} x
   * @param {number=} y
   */
  spriter.Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Vector} other
   */
  spriter.Vector.prototype.copy = function(other) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Vector} a
   * @param {spriter.Vector} b
   * @param {spriter.Vector=} out
   */
  spriter.Vector.add = function(a, b, out) {
    out = out || new spriter.Vector();
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Vector} other
   * @param {spriter.Vector=} out
   */
  spriter.Vector.prototype.add = function(other, out) {
    return spriter.Vector.add(this, other, out);
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Vector} other
   */
  spriter.Vector.prototype.selfAdd = function(other) {
    //return spriter.Vector.add(this, other, this);
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Vector} a
   * @param {spriter.Vector} b
   * @param {number} pct
   * @param {spriter.Vector=} out
   */
  spriter.Vector.tween = function(a, b, pct, out) {
    out = out || new spriter.Vector();
    out.x = tween(a.x, b.x, pct);
    out.y = tween(a.y, b.y, pct);
    return out;
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Vector} other
   * @param {number} pct
   * @param {spriter.Vector=} out
   */
  spriter.Vector.prototype.tween = function(other, pct, out) {
    return spriter.Vector.tween(this, other, pct, out);
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Vector} other
   * @param {number} pct
   */
  spriter.Vector.prototype.selfTween = function(other, pct) {
    return spriter.Vector.tween(this, other, pct, this);
  }

  /**
   * @constructor
   * @extends {spriter.Vector}
   */
  spriter.Scale = function() {
    spriter.Vector.call(this, 1, 1);
  }

  spriter.Scale.prototype = Object.create(spriter.Vector.prototype);
  spriter.Scale.constructor = spriter.Scale;

  /**
   * @return {spriter.Scale}
   */
  spriter.Scale.prototype.selfIdentity = function() {
    this.x = 1;
    this.y = 1;
    return this;
  }

  /**
   * @constructor
   * @extends {spriter.Vector}
   */
  spriter.Pivot = function() {
    spriter.Vector.call(this, 0, 1);
  }

  spriter.Pivot.prototype = Object.create(spriter.Vector.prototype);
  spriter.Pivot.constructor = spriter.Pivot;

  /**
   * @return {spriter.Pivot}
   */
  spriter.Pivot.prototype.selfIdentity = function() {
    this.x = 0;
    this.y = 1;
    return this;
  }

  /**
   * @constructor
   */
  spriter.Space = function() {
    this.position = new spriter.Vector();
    this.rotation = new spriter.Angle();
    this.scale = new spriter.Scale();
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space} other
   */
  spriter.Space.prototype.copy = function(other) {
    this.position.copy(other.position);
    this.rotation.copy(other.rotation);
    this.scale.copy(other.scale);
    return this;
  }

  /**
   * @return {spriter.Space}
   * @param {Object.<string,?>} json
   */
  spriter.Space.prototype.load = function(json) {
    this.position.x = loadFloat(json, 'x', 0);
    this.position.y = loadFloat(json, 'y', 0);
    this.rotation.deg = loadFloat(json, 'angle', 0);
    this.scale.x = loadFloat(json, 'scale_x', 1);
    this.scale.y = loadFloat(json, 'scale_y', 1);
    return this;
  }

  /**
   * @return {boolean}
   * @param {spriter.Space} a
   * @param {spriter.Space} b
   * @param {number=} epsilon
   */
  spriter.Space.equal = function(a, b, epsilon) {
    epsilon = epsilon || 1e-6;
    if (Math.abs(a.position.x - b.position.x) > epsilon) {
      return false;
    }
    if (Math.abs(a.position.y - b.position.y) > epsilon) {
      return false;
    }
    if (Math.abs(a.rotation.rad - b.rotation.rad) > epsilon) {
      return false;
    }
    if (Math.abs(a.scale.x - b.scale.x) > epsilon) {
      return false;
    }
    if (Math.abs(a.scale.y - b.scale.y) > epsilon) {
      return false;
    }
    return true;
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space=} out
   */
  spriter.Space.identity = function(out) {
    out = out || new spriter.Space();
    out.position.x = 0;
    out.position.y = 0;
    out.rotation.rad = 0;
    out.scale.x = 1;
    out.scale.y = 1;
    return out;
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space} space
   * @param {number} x
   * @param {number} y
   */
  spriter.Space.translate = function(space, x, y) {
    x *= space.scale.x;
    y *= space.scale.y;
    var rad = space.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    space.position.x += tx;
    space.position.y += ty;
    return space;
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space} space
   * @param {number} rad
   */
  spriter.Space.rotate = function(space, rad) {
    space.rotation.rad = wrapAngleRadians(space.rotation.rad + rad);
    return space;
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space} space
   * @param {number} x
   * @param {number} y
   */
  spriter.Space.scale = function(space, x, y) {
    space.scale.x *= x;
    space.scale.y *= y;
    return space;
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space} space
   * @param {spriter.Space=} out
   */
  spriter.Space.invert = function(space, out) {
    // invert
    // out.sca = space.sca.inv();
    // out.rot = space.rot.inv();
    // out.pos = space.pos.neg().rotate(space.rot.inv()).mul(space.sca.inv());

    out = out || new spriter.Space();
    var inv_scale_x = 1 / space.scale.x;
    var inv_scale_y = 1 / space.scale.y;
    var inv_rotation = -space.rotation.rad;
    var inv_x = -space.position.x;
    var inv_y = -space.position.y;
    out.scale.x = inv_scale_x;
    out.scale.y = inv_scale_y;
    out.rotation.rad = inv_rotation;
    var x = inv_x;
    var y = inv_y;
    var rad = inv_rotation;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.position.x = tx * inv_scale_x;
    out.position.y = ty * inv_scale_y;
    return out;
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space} a
   * @param {spriter.Space} b
   * @param {spriter.Space=} out
   */
  spriter.Space.combine = function(a, b, out) {
    // combine
    // out.pos = b.pos.mul(a.sca).rotate(a.rot).add(a.pos);
    // out.rot = b.rot.mul(a.rot);
    // out.sca = b.sca.mul(a.sca);

    out = out || new spriter.Space();
    var x = b.position.x * a.scale.x;
    var y = b.position.y * a.scale.y;
    var rad = a.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.position.x = tx + a.position.x;
    out.position.y = ty + a.position.y;
    if ((a.scale.x * a.scale.y) < 0) {
      out.rotation.rad = wrapAngleRadians(a.rotation.rad - b.rotation.rad);
    } else {
      out.rotation.rad = wrapAngleRadians(b.rotation.rad + a.rotation.rad);
    }
    out.scale.x = b.scale.x * a.scale.x;
    out.scale.y = b.scale.y * a.scale.y;
    return out;
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space} ab
   * @param {spriter.Space} a
   * @param {spriter.Space=} out
   */
  spriter.Space.extract = function(ab, a, out) {
    // extract
    // out.sca = ab.sca.mul(a.sca.inv());
    // out.rot = ab.rot.mul(a.rot.inv());
    // out.pos = ab.pos.add(a.pos.neg()).rotate(a.rot.inv()).mul(a.sca.inv());

    out = out || new spriter.Space();
    out.scale.x = ab.scale.x / a.scale.x;
    out.scale.y = ab.scale.y / a.scale.y;
    if ((a.scale.x * a.scale.y) < 0) {
      out.rotation.rad = wrapAngleRadians(a.rotation.rad + ab.rotation.rad);
    } else {
      out.rotation.rad = wrapAngleRadians(ab.rotation.rad - a.rotation.rad);
    }
    var x = ab.position.x - a.position.x;
    var y = ab.position.y - a.position.y;
    var rad = -a.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.position.x = tx / a.scale.x;
    out.position.y = ty / a.scale.y;
    return out;
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Space} space
   * @param {spriter.Vector} v
   * @param {spriter.Vector=} out
   */
  spriter.Space.transform = function(space, v, out) {
    out = out || new spriter.Vector();
    var x = v.x * space.scale.x;
    var y = v.y * space.scale.y;
    var rad = space.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.x = tx + space.position.x;
    out.y = ty + space.position.y;
    return out;
  }

  /**
   * @return {spriter.Vector}
   * @param {spriter.Space} space
   * @param {spriter.Vector} v
   * @param {spriter.Vector=} out
   */
  spriter.Space.untransform = function(space, v, out) {
    out = out || new spriter.Vector();
    var x = v.x - space.position.x;
    var y = v.y - space.position.y;
    var rad = -space.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.x = tx / space.scale.x;
    out.y = ty / space.scale.y;
    return out;
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Space} a
   * @param {spriter.Space} b
   * @param {number} tween
   * @param {number} spin
   * @param {spriter.Space=} out
   */
  spriter.Space.tween = function(a, b, twn, spin, out) {
    out.position.x = tween(a.position.x, b.position.x, twn);
    out.position.y = tween(a.position.y, b.position.y, twn);
    out.rotation.rad = tweenAngleRadians(a.rotation.rad, b.rotation.rad, twn, spin);
    out.scale.x = tween(a.scale.x, b.scale.x, twn);
    out.scale.y = tween(a.scale.y, b.scale.y, twn);
    return out;
  }

  /**
   * @constructor
   */
  spriter.File = function() {
    /** @type {number} */
    this.id = -1;
    /** @type {string} */
    this.name = '';
    /** @type {number} */
    this.width = 0;
    /** @type {number} */
    this.height = 0;
    /** @type {spriter.Pivot} */
    this.pivot = new spriter.Pivot();
  }

  /**
   * @return {spriter.File}
   * @param {Object.<string,?>} json
   */
  spriter.File.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.name = loadString(json, 'name', '');
    this.width = loadInt(json, 'width', 0);
    this.height = loadInt(json, 'height', 0);
    this.pivot.x = loadFloat(json, 'pivot_x', 0);
    this.pivot.y = loadFloat(json, 'pivot_y', 1);
    return this;
  }

  /**
   * @constructor
   */
  spriter.Folder = function() {
    /** @type {number} */
    this.id = -1;
    /** @type {Array.<spriter.File>} */
    this.file_array = [];
  }

  /**
   * @return {spriter.Folder}
   * @param {Object.<string,?>} json
   */
  spriter.Folder.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.file_array.length = 0;
    json.file = makeArray(json.file);
    var file;
    for (var i = 0; i < json.file.length; i++) {
      file = json.file[i];
      this.file_array.push(new spriter.File().load(file));
    }
    return this;
  }

  /**
   * @constructor
   */
  spriter.Bone = function() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.parent_index = -1;
    /** @type {spriter.Space} */
    this.local_space = new spriter.Space();
    /** @type {spriter.Space} */
    this.world_space = new spriter.Space();
  }

  /**
   * @return {spriter.Bone}
   * @param {Object.<string,?>} json
   */
  spriter.Bone.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.parent_index = loadInt(json, 'parent', -1);
    this.local_space.load(json);
    this.world_space.copy(this.local_space);
    return this;
  }

  /**
   * @return {spriter.Bone}
   * @param {spriter.Bone=} other
   */
  spriter.Bone.prototype.clone = function(other) {
    return (other || new spriter.Bone()).copy(this);
  }

  /**
   * @return {spriter.Bone}
   * @param {spriter.Bone} other
   */
  spriter.Bone.prototype.copy = function(other) {
    this.id = other.id;
    this.parent_index = other.parent_index;
    this.local_space.copy(other.local_space);
    this.world_space.copy(other.world_space);
    return this;
  }

  /**
   * @return {void}
   * @param {spriter.Bone} other
   * @param {number} tween
   * @param {number} spin
   */
  spriter.Bone.prototype.tween = function(other, tween, spin) {
    spriter.Space.tween(this.local_space, other.local_space, tween, spin, this.local_space);
  }

  /**
   * @return {spriter.Space}
   * @param {spriter.Bone} bone
   * @param {Array.<spriter.Bone>} bones
   * @param {spriter.Space=} out
   */
  spriter.Bone.flatten = function(bone, bones, out) {
    out = out || new spriter.Space();

    var parent_bone = bones[bone.parent_index];
    if (parent_bone) {
      spriter.Bone.flatten(parent_bone, bones, out);
    } else {
      spriter.Space.identity(out);
    }

    spriter.Space.combine(out, bone.local_space, out);

    return out;
  }

  /**
   * @constructor
   */
  spriter.BoneRef = function() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.parent_index = -1;
    /** @type {number} */
    this.timeline_index = -1;
    /** @type {number} */
    this.keyframe_index = -1;
  }

  /**
   * @return {spriter.BoneRef}
   * @param {Object.<string,?>} json
   */
  spriter.BoneRef.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.parent_index = loadInt(json, 'parent', -1);
    this.timeline_index = loadInt(json, 'timeline', -1);
    this.keyframe_index = loadInt(json, 'key', -1);
    return this;
  }

  /**
   * @return {spriter.BoneRef}
   * @param {spriter.BoneRef=} other
   */
  spriter.BoneRef.prototype.clone = function(other) {
    return (other || new spriter.BoneRef()).copy(this);
  }

  /**
   * @return {spriter.BoneRef}
   * @param {spriter.BoneRef} other
   */
  spriter.BoneRef.prototype.copy = function(other) {
    this.id = other.id;
    this.parent_index = other.parent_index;
    this.timeline_index = other.timeline_index;
    this.keyframe_index = other.keyframe_index;
    return this;
  }

  /**
   * @constructor
   */
  spriter.Object = function() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.parent_index = -1;
    /** @type {number} */
    this.folder_index = -1;
    /** @type {number} */
    this.file_index = -1;
    /** @type {spriter.Space} */
    this.local_space = new spriter.Space();
    /** @type {spriter.Space} */
    this.world_space = new spriter.Space();
    /** @type {boolean} */
    this.default_pivot = false;
    /** @type {spriter.Pivot} */
    this.pivot = new spriter.Pivot();
    /** @type {number} */
    this.z_index = 0;
    /** @type {number} */
    this.alpha = 1;
  }

  /**
   * @return {spriter.Object}
   * @param {Object.<string,?>} json
   */
  spriter.Object.prototype.load = function(data, json) {
    this.id = loadInt(json, 'id', -1);
    this.parent_index = loadInt(json, 'parent', -1);
    this.folder_index = loadInt(json, 'folder', -1);
    this.file_index = loadInt(json, 'file', -1);
    this.local_space.load(json);
    this.world_space.copy(this.local_space);
    if ((typeof(json['pivot_x']) !== 'undefined') ||
      (typeof(json['pivot_y']) !== 'undefined')) {
      this.pivot.x = loadFloat(json, 'pivot_x', 0);
      this.pivot.y = loadFloat(json, 'pivot_y', 1);
    } else {
      this.default_pivot = true;
      var file = data.getFile(this.folder_index, this.file_index);
      this.pivot.copy(file.pivot);
    }
    this.z_index = loadInt(json, 'z_index', 0);
    this.alpha = loadFloat(json, 'a', 1);
    return this;
  }

  /**
   * @return {spriter.Object}
   * @param {spriter.Object=} other
   */
  spriter.Object.prototype.clone = function(other) {
    return (other || new spriter.Object()).copy(this);
  }

  /**
   * @return {spriter.Object}
   * @param {spriter.Object} other
   */
  spriter.Object.prototype.copy = function(other) {
    this.id = other.id;
    this.parent_index = other.parent_index;
    this.folder_index = other.folder_index;
    this.file_index = other.file_index;
    this.local_space.copy(other.local_space);
    this.world_space.copy(other.world_space);
    this.default_pivot = other.default_pivot;
    this.pivot.copy(other.pivot);
    this.z_index = other.z_index;
    this.alpha = other.alpha;
    return this;
  }

  /**
   * @return {void}
   * @param {spriter.Object} other
   * @param {number} twn
   * @param {number} spin
   */
  spriter.Object.prototype.tween = function(other, twn, spin) {
    spriter.Space.tween(this.local_space, other.local_space, twn, spin, this.local_space);
    spriter.Vector.tween(this.pivot, other.pivot, twn, this.pivot);
    this.alpha = tween(this.alpha, other.alpha, twn);
  }

  /**
   * @constructor
   */
  spriter.ObjectRef = function() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.parent_index = -1;
    /** @type {number} */
    this.timeline_index = -1;
    /** @type {number} */
    this.keyframe_index = -1;
    /** @type {number} */
    this.z_index = 0;
  }

  /**
   * @return {spriter.ObjectRef}
   * @param {Object.<string,?>} json
   */
  spriter.ObjectRef.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.parent_index = loadInt(json, 'parent', -1);
    this.timeline_index = loadInt(json, 'timeline', -1);
    this.keyframe_index = loadInt(json, 'key', -1);
    this.z_index = loadInt(json, 'z_index', 0);
    return this;
  }

  /**
   * @return {spriter.ObjectRef}
   * @param {spriter.ObjectRef=} other
   */
  spriter.ObjectRef.prototype.clone = function(other) {
    return (other || new spriter.ObjectRef()).copy(this);
  }

  /**
   * @return {spriter.ObjectRef}
   * @param {spriter.ObjectRef} other
   */
  spriter.ObjectRef.prototype.copy = function(other) {
    this.id = other.id;
    this.parent_index = other.parent_index;
    this.timeline_index = other.timeline_index;
    this.keyframe_index = other.keyframe_index;
    this.z_index = other.z_index;
    return this;
  }

  /**
   * @constructor
   */
  spriter.Keyframe = function() {
    /** @type {number} */
    this.id = -1;
    /** @type {number} */
    this.time = 0;
  }

  /**
   * @return {spriter.Keyframe}
   * @param {Object.<string,?>} json
   */
  spriter.Keyframe.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.time = loadInt(json, 'time', 0);
    return this;
  }

  /**
   * @return {number}
   * @param {Array.<spriter.Keyframe>} array
   * @param {number} time
   */
  spriter.Keyframe.find = function(array, time) {
    if (array.length <= 0) {
      return -1;
    }
    if (time < array[0].time) {
      return -1;
    }
    var last = array.length - 1;
    if (time >= array[last].time) {
      return last;
    }
    var lo = 0;
    var hi = last;
    if (hi === 0) {
      return 0;
    }
    var current = hi >> 1;
    while (true) {
      if (array[current + 1].time <= time) {
        lo = current + 1;
      } else {
        hi = current;
      }
      if (lo === hi) {
        return lo;
      }
      current = (lo + hi) >> 1;
    }
  }

  /**
   * @return {number}
   * @param {spriter.Keyframe} a
   * @param {spriter.Keyframe} b
   */
  spriter.Keyframe.compare = function(a, b) {
    return a.time - b.time;
  }

  /**
   * @constructor
   * @extends {spriter.Keyframe}
   */
  spriter.MainlineKeyframe = function() {
    spriter.Keyframe.call(this);

    /** @type {Array.<spriter.Bone|spriter.BoneRef>} */
    this.bone_array = null;
    /** @type {Array.<spriter.Object|spriter.ObjectRef>} */
    this.object_array = null;
  }

  spriter.MainlineKeyframe.prototype = Object.create(spriter.Keyframe.prototype);
  spriter.MainlineKeyframe.constructor = spriter.MainlineKeyframe;

  /**
   * @return {spriter.MainlineKeyframe}
   * @param {Object.<string,?>} json
   */
  spriter.MainlineKeyframe.prototype.load = function(data, json) {
    var i, len;

    spriter.Keyframe.prototype.load.call(this, json)

    // combine bones and bone_refs into one array and sort by id
    this.bone_array = [];

    json.bone = makeArray(json.bone);
    for (i = 0, len = json.bone.length; i < len; i++) {
      this.bone_array.push(new spriter.Bone().load(json.bone[i]));
    }

    json.bone_ref = makeArray(json.bone_ref);
    for (i = 0, len = json.bone_ref.length; i < len; i++) {
      this.bone_array.push(new spriter.BoneRef().load(json.bone_ref[i]));
    }

    this.bone_array = this.bone_array.sort(function(a, b) {
      return a.id - b.id;
    });

    // combine objects and object_refs into one array and sort by id
    this.object_array = [];

    json.object = makeArray(json.object);
    json.object.forEach(function(object_json) {
    });
    for (i = 0, len = json.object.length; i < len; i++) {
      this.object_array.push(new spriter.Object().load(data, json.object[i]));
    }

    json.object_ref = makeArray(json.object_ref);
    for (i = 0, len = json.object_ref.length; i < len; i++) {
      this.object_array.push(new spriter.ObjectRef().load(json.object_ref[i]));
    }

    this.object_array = this.object_array.sort(function(a, b) {
      return a.id - b.id;
    });

    return this;
  }

  /**
   * @constructor
   */
  spriter.Mainline = function() {
    /** @type {Array.<spriter.MainlineKeyframe>} */
    this.keyframe_array = null;
  }

  /**
   * @return {spriter.Mainline}
   * @param {Object.<string,?>} json
   */
  spriter.Mainline.prototype.load = function(data, json) {
    this.keyframe_array = [];
    json.key = makeArray(json.key);
    for (var i = 0, len = json.key.length; i < len; i++) {
      this.keyframe_array.push(new spriter.MainlineKeyframe().load(data, json.key[i]));
    }
    this.keyframe_array = this.keyframe_array.sort(spriter.Keyframe.compare);
    return this;
  }

  /**
   * @constructor
   * @extends {spriter.Keyframe}
   * @param {string} type
   */
  spriter.TimelineKeyframe = function(type) {
    spriter.Keyframe.call(this);
    this.type = type;

    /** @type {string} */
    this.type = '';
    /** @type {number} */
    this.spin = 1; // 1: counter-clockwise, -1: clockwise
    /** @type {number} */
    this.curve = 1; // 0: instant, 1: linear, 2: quadratic, 3: cubic
    /** @type {number} */
    this.c1 = 0;
    /** @type {number} */
    this.c2 = 0;
  }

  spriter.TimelineKeyframe.prototype = Object.create(spriter.Keyframe.prototype);
  spriter.TimelineKeyframe.constructor = spriter.TimelineKeyframe;

  /**
   * @return {spriter.TimelineKeyframe}
   * @param {Object.<string,?>} json
   */
  spriter.TimelineKeyframe.prototype.load = function(json) {
    this.id = loadInt(json, 'id', -1);
    this.time = loadInt(json, 'time', 0);
    this.spin = loadInt(json, 'spin', 1);
    this.curve = loadInt(json, 'curve_type', 1);
    this.c1 = loadInt(json, 'c1', 0);
    this.c2 = loadInt(json, 'c2', 0);
    return this;
  }

  spriter.TimelineKeyframe.prototype.evaluateCurve = function(time, time1, time2) {
    if (time1 === time2) {
      return 0;
    }
    if (this.curve === 0) {
      return 0;
    } // instant
    var tween = (time - time1) / (time2 - time1);
    if (this.curve === 1) {
      return tween;
    } // linear
    if (this.curve === 2) {
      return interpolateQuadratic(0.0, this.c1, 1.0, tween);
    }
    if (this.curve === 3) {
      return interpolateCubic(0.0, this.c1, this.c2, 1.0, tween);
    }
    return 0;
  }

  /**
   * @constructor
   * @extends {spriter.TimelineKeyframe}
   */
  spriter.BoneTimelineKeyframe = function() {
    spriter.TimelineKeyframe.call(this, 'bone');

    /** @type {spriter.Bone} */
    this.bone = null;
  }

  spriter.BoneTimelineKeyframe.prototype = Object.create(spriter.TimelineKeyframe.prototype);
  spriter.BoneTimelineKeyframe.constructor = spriter.BoneTimelineKeyframe;

  /**
   * @return {spriter.TimelineKeyframe}
   * @param {Object.<string,?>} json
   */
  spriter.BoneTimelineKeyframe.prototype.load = function(json) {
    spriter.TimelineKeyframe.prototype.load.call(this, json);
    this.bone = new spriter.Bone().load(json.bone || {});
    return this;
  }

  /**
   * @constructor
   * @extends {spriter.TimelineKeyframe}
   */
  spriter.ObjectTimelineKeyframe = function() {
    spriter.TimelineKeyframe.call(this, 'object');

    /** @type {spriter.Object} */
    this.object = null;
  }

  spriter.ObjectTimelineKeyframe.prototype = Object.create(spriter.TimelineKeyframe.prototype);
  spriter.ObjectTimelineKeyframe.constructor = spriter.ObjectTimelineKeyframe;

  /**
   * @return {spriter.TimelineKeyframe}
   * @param {Object.<string,?>} json
   */
  spriter.ObjectTimelineKeyframe.prototype.load = function(data, json) {
    spriter.TimelineKeyframe.prototype.load.call(this, json);
    this.object = new spriter.Object().load(data, json.object || {});
    return this;
  }

  /**
   * @constructor
   */
  spriter.Timeline = function(animation) {
    this.animation = animation;

    /** @type {number} */
    this.id = -1;
    /** @type {string} */
    this.name = '';
    /** @type {string} */
    this.type = '';
    /** @type {number} */
    this.index = -1;

    /** @type {Array.<spriter.TimelineKeyframe>} */
    this.keyframe_array = null;
  }

  /**
   * @return {spriter.Timeline}
   * @param {Object.<string,?>} json
   */
  spriter.Timeline.prototype.load = function(data, json) {
    var i, len;

    this.id = loadInt(json, 'id', -1);
    this.name = loadString(json, 'name', '');
    this.type = loadString(json, 'object_type', 'sprite');
    this.index = loadInt(json, 'obj', -1);

    this.keyframe_array = [];
    json.key = makeArray(json.key);
    switch (this.type) {
      case 'sprite':
        for (i = 0, len = json.key.length; i < len; i++) {
          this.keyframe_array.push(new spriter.ObjectTimelineKeyframe().load(data, json.key[i]));
        }
        var sprites = this.animation.entity.sprites;
        var sprite = sprites[this.name];
        if (!sprite) {
          sprite = new PIXI.Sprite(getTextureForObject(data, this.keyframe_array[0].object));
          sprite.anchor.set(0.5, 0.5);
          sprite.name = this.name;
          sprites[this.name] = sprite;
        }
        break;
      case 'bone':
        for (i = 0, len = json.key.length; i < len; i++) {
          this.keyframe_array.push(new spriter.BoneTimelineKeyframe().load(json.key[i]));
        }
        break;
      case 'box':
      case 'point':
      case 'sound':
      case 'entity':
      case 'variable':
      default:
        console.log('TODO: spriter.Timeline::load', this.type);
        break;
    }
    this.keyframe_array = this.keyframe_array.sort(spriter.Keyframe.compare);

    return this;
  }

  /**
   * @constructor
   */
  spriter.Animation = function(entity) {
    this.entity = entity;
    /** @type {number} */
    this.id = -1;
    /** @type {string} */
    this.name = '';
    /** @type {number} */
    this.length = 0;
    /** @type {string} */
    this.looping = 'true'; // 'true', 'false' or 'ping_pong'
    /** @type {number} */
    this.loop_to = 0;
    /** @type {spriter.Mainline} */
    this.mainline = null;
    /** @type {Array.<spriter.Timeline>} */
    this.timeline_array = null;
    /** @type {number} */
    this.min_time = 0;
    /** @type {number} */
    this.max_time = 0;
  }

  /**
   * @return {spriter.Animation}
   * @param {Object.<string,?>} json
   */
  spriter.Animation.prototype.load = function(data, json) {
    this.id = loadInt(json, 'id', -1);
    this.name = loadString(json, 'name', '');
    this.length = loadInt(json, 'length', 0);
    this.looping = loadString(json, 'looping', 'true');
    this.loop_to = loadInt(json, 'loop_to', 0);

    json.mainline = json.mainline || {};
    this.mainline = new spriter.Mainline().load(data, json.mainline);

    this.timeline_array = [];
    json.timeline = makeArray(json.timeline);
    for (var i = 0, len = json.timeline.length; i < len; i++) {
      this.timeline_array.push(new spriter.Timeline(this).load(data, json.timeline[i]));
    }

    this.min_time = 0;
    this.max_time = this.length;

    return this;
  }

  /**
   * @constructor
   */
  spriter.SpriterAnimation = function(sconKey, entityName) {
    PIXI.Container.call(this);
    this.scale.y = -1; // FIXME: inverse the transform instead of set y scale

    var data = spriter.getData(sconKey);
    var entityDef = data.getEntityData(entityName);

    /** @type {Object} definitation data */
    this.data = data;
    /** @type {number} */
    this.id = loadInt(entityDef, 'id', -1);
    /** @type {string} */
    this.name = loadString(entityDef, 'name', '');
    /** @type {Object.<string,spriter.Animation>} */
    this.animation_map = {};
    /** @type {Array.<string>} */
    this.animation_keys = [];

    /** @type {Array.<spriter.Bone>} */
    this.bone_array = [];
    /** @type {Array.<spriter.Object>} */
    this.object_array = [];
    /** @type {string} */
    this.anim_key = '';
    /** @type {number} */
    this.time = 0;
    /** @type {number} */
    this.elapsed_time = 0;

    /** @type {boolean} */
    this.dirty = true;

    /**
     * Stores all the sprite instances for this entity
     * @type {PIXI.Sprite}
     * @private
     */
    this.sprites = {};

    // Create entities as PIXI.Container when use instead of here
    // data.entity_map = {};
    // data.entity_keys = [];

    // data.entity_keys.forEach(function(entity_key) {
    //   var entity = data.entity_map[entity_key];

    //   entity.animation_keys.forEach(function(animation_key) {
    //     var animation = entity.animation_map[animation_key];

    //     animation.mainline.keyframe_array.forEach(function(mainline_keyframe) {
    //       mainline_keyframe.object_array.forEach(function(object) {
    //         if (object instanceof spriter.Object) {
    //           if (object.default_pivot) {
    //             var folder = data.folder_array[object.folder_index];
    //             var file = folder.file_array[object.file_index];
    //             object.pivot.copy(file.pivot);
    //           }
    //         }
    //       });
    //     });

    //     animation.timeline_array.forEach(function(timeline) {
    //       timeline.keyframe_array.forEach(function(timeline_keyframe) {
    //         if (timeline_keyframe instanceof spriter.ObjectTimelineKeyframe) {
    //           var object = timeline_keyframe.object;
    //           if (object.default_pivot) {
    //             var folder = data.folder_array[object.folder_index];
    //             var file = folder.file_array[object.file_index];
    //             object.pivot.copy(file.pivot);
    //           }
    //         }
    //       });
    //     });
    //   });
    // });

    // Create animations
    for (var i = 0, len = entityDef.animation.length; i < len; i++) {
      var animation = new spriter.Animation(this).load(data, entityDef.animation[i]);
      this.animation_map[animation.name] = animation;
      this.animation_keys.push(animation.name);
    }
  }

  spriter.SpriterAnimation.prototype = Object.create(PIXI.Container.prototype);
  spriter.SpriterAnimation.prototype.constructor = spriter.SpriterAnimation;

  spriter.SpriterAnimation.prototype.play = function(anim, loop) {
    console.log((loop ? 'loop' : 'play') + ': %s', anim);
    this.setAnim(anim);
  };
  spriter.SpriterAnimation.prototype.currAnim = function() {
    return this.animation_map[this.anim_key];
  };
  spriter.SpriterAnimation.prototype.getAnim = function() {
    return this.anim_key;
  };
  spriter.SpriterAnimation.prototype.setAnim = function(anim_key) {
    if (this.anim_key !== anim_key) {
      this.anim_key = anim_key;
      var anim = this.currAnim();
      if (anim) {
        this.time = wrap(this.time, anim.min_time, anim.max_time);
      }
      this.elapsed_time = 0;
      this.dirty = true;
    }
  };
  spriter.SpriterAnimation.prototype.getTime = function() {
    return this.time;
  };
  spriter.SpriterAnimation.prototype.setTime = function(time) {
    var anim = this.currAnim();
    if (anim) {
      time = wrap(time, anim.min_time, anim.max_time);
    }

    if (this.time !== time) {
      this.time = time;
      this.elapsed_time = 0;
      this.dirty = true;
    }
  };
  spriter.SpriterAnimation.prototype.update = function(elapsed) {
    this.setTime(this.getTime() + elapsed);
  };
  spriter.SpriterAnimation.prototype.strike = function() {
    if (!this.dirty) {
      return;
    }
    this.dirty = false;

    var anim = this.currAnim();

    var time = this.time;
    var elapsed_time = this.elapsed_time;
    this.elapsed_time = 0; // reset for next update

    var sprAnim = this;

    if (anim) {
      var mainline_keyframe_array = anim.mainline.keyframe_array;
      var mainline_keyframe_index = spriter.Keyframe.find(mainline_keyframe_array, time);
      var mainline_keyframe = mainline_keyframe_array[mainline_keyframe_index];

      var timeline_array = anim.timeline_array;

      var data_bone_array = mainline_keyframe.bone_array;
      var pose_bone_array = sprAnim.bone_array;

      data_bone_array.forEach(function(data_bone, bone_index) {
        var pose_bone = pose_bone_array[bone_index] = (pose_bone_array[bone_index] || new spriter.Bone());

        if (data_bone instanceof spriter.BoneRef) {
          // bone is a spriter.BoneRef, dereference
          var timeline_index = data_bone.timeline_index;
          var keyframe_index = data_bone.keyframe_index;
          var timeline = timeline_array[timeline_index];
          var timeline_keyframe_array = timeline.keyframe_array;
          var timeline_keyframe = timeline_keyframe_array[keyframe_index];

          var time1 = timeline_keyframe.time;
          var bone1 = timeline_keyframe.bone;
          pose_bone.copy(bone1);
          pose_bone.parent_index = data_bone.parent_index; // set parent from bone_ref

          // see if there's something to tween with
          var keyframe_index2 = (keyframe_index + 1) % timeline_keyframe_array.length;
          if (keyframe_index !== keyframe_index2) {
            var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
            var time2 = timeline_keyframe2.time;
            if (time2 < time1) {
              time2 = anim.length;
            }
            var bone2 = timeline_keyframe2.bone;

            var tween = timeline_keyframe.evaluateCurve(time, time1, time2);
            pose_bone.tween(bone2, tween, timeline_keyframe.spin);
          }
        } else if (data_bone instanceof spriter.Bone) {
          // bone is a spriter.Bone, copy
          pose_bone.copy(data_bone);
        } else {
          throw new Error();
        }
      });

      // clamp output bone array
      pose_bone_array.length = data_bone_array.length;

      pose_bone_array.forEach(function(bone) {
        var parent_bone = pose_bone_array[bone.parent_index];
        if (parent_bone) {
          spriter.Space.combine(parent_bone.world_space, bone.local_space, bone.world_space);
        } else {
          bone.world_space.copy(bone.local_space);
        }
      });

      var data_object_array = mainline_keyframe.object_array;
      var pose_object_array = sprAnim.object_array;

      data_object_array.forEach(function(data_object, object_index) {
        var pose_object = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.Object());

        if (data_object instanceof spriter.ObjectRef) {
          // object is a spriter.ObjectRef, dereference
          var timeline_index = data_object.timeline_index;
          var keyframe_index = data_object.keyframe_index;
          var timeline = timeline_array[timeline_index];
          var timeline_keyframe_array = timeline.keyframe_array;
          var timeline_keyframe = timeline_keyframe_array[keyframe_index];

          var time1 = timeline_keyframe.time;
          var object1 = timeline_keyframe.object;

          pose_object.copy(object1);
          pose_object.parent_index = data_object.parent_index; // set parent from object_ref

          // see if there's something to tween with
          var keyframe_index2 = (keyframe_index + 1) % timeline_keyframe_array.length;
          if (keyframe_index !== keyframe_index2) {
            var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
            var time2 = timeline_keyframe2.time;
            if (time2 < time1) {
              time2 = anim.length;
            }
            var object2 = timeline_keyframe2.object;

            var tween = timeline_keyframe.evaluateCurve(time, time1, time2);
            pose_object.tween(object2, tween, timeline_keyframe.spin);
          }
        } else if (data_object instanceof spriter.Object) {
          // object is a spriter.Object, copy
          pose_object.copy(data_object);
        } else {
          throw new Error();
        }
      });

      // clamp output object array
      pose_object_array.length = data_object_array.length;

      this.removeChildren();

      pose_object_array.forEach(function(object, idx) {
        var bone = pose_bone_array[object.parent_index];
        if (bone) {
          spriter.Space.combine(bone.world_space, object.local_space, object.world_space);
          var folder = sprAnim.data.folder_array[object.folder_index];
          var file = folder.file_array[object.file_index];
          var offset_x = (0.5 - object.pivot.x) * file.width;
          var offset_y = (0.5 - object.pivot.y) * file.height;
          spriter.Space.translate(object.world_space, offset_x, offset_y);
        } else {
          object.world_space.copy(object.local_space);
        }

        // TODO: update object transform
        var timeline_index = data_object_array[idx].timeline_index;
        var timeline = timeline_array[timeline_index];

        var sprites = sprAnim.sprites;
        var sprite = sprites[timeline.name];
        // Apply transform
        var model = object.world_space;
        sprite.position.set(model.position.x, model.position.y);
        sprite.rotation = model.rotation.rad;
        sprite.scale.set(model.scale.x, -model.scale.y);
        sprite.alpha = object.alpha;

        sprAnim.addChild(sprite);
      });
    }
  };

  /**
   * Data is the in memory structure that stores data of a scon file
   * @constructor
   */
  spriter.Data = function(scon) {
    /**
     * Scon data object
     * @type {Object}
     */
    this.scon = scon;

    /** @type {Array.<spriter.Folder>} */
    this.folder_array = [];

    /** @type {Object} entityName -> entityData map */
    this.entityDataMap = {};

    /** Scon file version */
    this.sconVersion = loadString(scon, 'scon_version', '');
    /** Scon file generator application */
    this.generator = loadString(scon, 'generator', '');
    /** Scon file generator application version */
    this.generatorVersion = loadString(scon, 'generator_version', '');

    var i, len;
    // Fetch folder and file data
    for (i = 0, len = scon.folder.length; i < len; i++) {
      this.folder_array.push(new spriter.Folder().load(scon.folder[i]));
    }

    // Construct entity data map
    var entity;
    for (i = 0, len = scon.entity.length; i < len; i++) {
      entity = scon.entity[i];
      this.entityDataMap[entity.name] = entity;
    }
  }

  spriter.Data.prototype.getFile = function(folderIdx, fileIdx) {
    return this.folder_array[folderIdx].file_array[fileIdx];
  };

  /**
   * Get entity data
   * @param  {String} entityName Name of the entity
   * @return {Object}            Defination data object
   */
  spriter.Data.prototype.getEntityData = function(entityName) {
    return this.entityDataMap[entityName];
  };

  /**
   * @return {spriter.Data}
   * @param {?} json
   */
  spriter.Data.prototype.load = function(json) {
    // data.entity_map = {};
    // data.entity_keys = [];
    // json.spriter_data.entity = makeArray(json.entity);
    // json.spriter_data.entity.forEach(function(entity_json) {
    //   var entity = new spriter.SpriterAnimation().load(data, entity_json);
    //   data.entity_map[entity.name] = entity;
    //   data.entity_keys.push(entity.name);
    // });

    // // patch spriter.Object::pivot

    // data.entity_keys.forEach(function(entity_key) {
    //   var entity = data.entity_map[entity_key];

    //   entity.animation_keys.forEach(function(animation_key) {
    //     var animation = entity.animation_map[animation_key];

    //     animation.mainline.keyframe_array.forEach(function(mainline_keyframe) {
    //       mainline_keyframe.object_array.forEach(function(object) {
    //         if (object instanceof spriter.Object) {
    //           if (object.default_pivot) {
    //             var folder = data.folder_array[object.folder_index];
    //             var file = folder.file_array[object.file_index];
    //             object.pivot.copy(file.pivot);
    //           }
    //         }
    //       });
    //     });

    //     animation.timeline_array.forEach(function(timeline) {
    //       timeline.keyframe_array.forEach(function(timeline_keyframe) {
    //         if (timeline_keyframe instanceof spriter.ObjectTimelineKeyframe) {
    //           var object = timeline_keyframe.object;
    //           if (object.default_pivot) {
    //             var folder = data.folder_array[object.folder_index];
    //             var file = folder.file_array[object.file_index];
    //             object.pivot.copy(file.pivot);
    //           }
    //         }
    //       });
    //     });
    //   });
    // });
  }

  /**
   * @return {Object.<string, spriter.SpriterAnimation>}
   */
  spriter.Data.prototype.getEntities = function() {
    return this.entity_map;
  }

  /**
   * @return {Array.<string>}
   */
  spriter.Data.prototype.getEntityKeys = function() {
    return this.entity_keys;
  }

  /**
   * @return {Object.<string, spriter.Animation>}
   * @param {string} entity_key
   */
  spriter.Data.prototype.getAnims = function(entity_key) {
    var entity = this.entity_map && this.entity_map[entity_key];
    if (entity) {
      return entity.animation_map;
    }
    return null;
  }

  /**
   * @return {Array.<string>}
   * @param {string} entity_key
   */
  spriter.Data.prototype.getAnimKeys = function(entity_key) {
    var entity = this.entity_map && this.entity_map[entity_key];
    if (entity) {
      return entity.animation_keys;
    }
    return null;
  }

  /**
   * @constructor
   * @param {spriter.Data=} data
   */
  spriter.Pose = function(data) {
    /** @type {spriter.Data} */
    this.data = data || null;
    /** @type {Array.<spriter.Bone>} */
    this.bone_array = [];
    /** @type {Array.<spriter.Object>} */
    this.object_array = [];
    /** @type {string} */
    this.entity_key = '';
    /** @type {string} */
    this.anim_key = '';
    /** @type {number} */
    this.time = 0;
    /** @type {number} */
    this.elapsed_time = 0;

    /** @type {boolean} */
    this.dirty = true;

    // Assign self as property of entities
    for (var e in data.entity_map) {
      data.entity_map[e].pose = this;
    }
    this.entities = data.entity_map;

    this.container = new PIXI.Container();
    this.container.scale.y = -1;
  }

  /**
   * @return {Object.<string, spriter.SpriterAnimation>}
   */
  spriter.Pose.prototype.getEntities = function() {
    if (this.data) {
      return this.data.getEntities();
    }
    return null;
  }

  /**
   * @return {Array.<string>}
   */
  spriter.Pose.prototype.getEntityKeys = function() {
    if (this.data) {
      return this.data.getEntityKeys();
    }
    return null;
  }

  /**
   * @return {spriter.SpriterAnimation}
   */
  spriter.Pose.prototype.curEntity = function() {
    var entity_map = this.data.entity_map;
    return entity_map && entity_map[this.entity_key];
  }

  /**
   * @return {string}
   */
  spriter.Pose.prototype.getEntity = function() {
    return this.entity_key;
  }

  /**
   * @return {void}
   * @param {string} entity_key
   */
  spriter.Pose.prototype.setEntity = function(entity_key) {
    if (this.entity_key !== entity_key) {
      this.entity_key = entity_key;
      this.anim_key = '';
      this.time = 0;
      this.dirty = true;
    }
  }

  /**
   * @return {Object.<string, spriter.Animation>}
   */
  spriter.Pose.prototype.getAnims = function() {
    if (this.data) {
      return this.data.getAnims(this.entity_key);
    }
    return null;
  }

  /**
   * @return {Object.<string>}
   */
  spriter.Pose.prototype.getAnimKeys = function() {
    if (this.data) {
      return this.data.getAnimKeys(this.entity_key);
    }
    return null;
  }

  /**
   * @return {spriter.Animation}
   */
  spriter.Pose.prototype.currAnim = function() {
    var anims = this.getAnims();
    return anims && anims[this.anim_key];
  }

  /**
   * @return {string}
   */
  spriter.Pose.prototype.getAnim = function() {
    return this.anim_key;
  }

  /**
   * @return {void}
   * @param {string} anim_key
   */
  spriter.Pose.prototype.setAnim = function(anim_key) {
    if (this.anim_key !== anim_key) {
      this.anim_key = anim_key;
      var anim = this.currAnim();
      if (anim) {
        this.time = wrap(this.time, anim.min_time, anim.max_time);
      }
      this.elapsed_time = 0;
      this.dirty = true;
    }
  }

  /**
   * @return {number}
   */
  spriter.Pose.prototype.getTime = function() {
    return this.time;
  }

  /**
   * @return {void}
   * @param {number} time
   */
  spriter.Pose.prototype.setTime = function(time) {
    var anim = this.currAnim();
    if (anim) {
      time = wrap(time, anim.min_time, anim.max_time);
    }

    if (this.time !== time) {
      this.time = time;
      this.elapsed_time = 0;
      this.dirty = true;
    }
  }

  /**
   * @return {void}
   * @param {number} elapsed_time
   */
  spriter.Pose.prototype.update = function(elapsed_time) {
    this.setTime(this.getTime() + elapsed_time);
  }

  /**
   * @return {void}
   */
  spriter.Pose.prototype.strike = function() {
    var pose = this;
    if (!pose.dirty) {
      return;
    }
    pose.dirty = false;

    var anim = pose.currAnim();

    var time = pose.time;
    var elapsed_time = pose.elapsed_time;

    pose.elapsed_time = 0; // reset elapsed time for next update

    if (anim) {
      var mainline_keyframe_array = anim.mainline.keyframe_array;
      var mainline_keyframe_index = spriter.Keyframe.find(mainline_keyframe_array, time);
      var mainline_keyframe = mainline_keyframe_array[mainline_keyframe_index];

      var timeline_array = anim.timeline_array;

      var data_bone_array = mainline_keyframe.bone_array;
      var pose_bone_array = pose.bone_array;

      data_bone_array.forEach(function(data_bone, bone_index) {
        var pose_bone = pose_bone_array[bone_index] = (pose_bone_array[bone_index] || new spriter.Bone());

        if (data_bone instanceof spriter.BoneRef) {
          // bone is a spriter.BoneRef, dereference
          var timeline_index = data_bone.timeline_index;
          var keyframe_index = data_bone.keyframe_index;
          var timeline = timeline_array[timeline_index];
          var timeline_keyframe_array = timeline.keyframe_array;
          var timeline_keyframe = timeline_keyframe_array[keyframe_index];

          var time1 = timeline_keyframe.time;
          var bone1 = timeline_keyframe.bone;
          pose_bone.copy(bone1);
          pose_bone.parent_index = data_bone.parent_index; // set parent from bone_ref

          // see if there's something to tween with
          var keyframe_index2 = (keyframe_index + 1) % timeline_keyframe_array.length;
          if (keyframe_index !== keyframe_index2) {
            var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
            var time2 = timeline_keyframe2.time;
            if (time2 < time1) {
              time2 = anim.length;
            }
            var bone2 = timeline_keyframe2.bone;

            var tween = timeline_keyframe.evaluateCurve(time, time1, time2);
            pose_bone.tween(bone2, tween, timeline_keyframe.spin);
          }
        } else if (data_bone instanceof spriter.Bone) {
          // bone is a spriter.Bone, copy
          pose_bone.copy(data_bone);
        } else {
          throw new Error();
        }
      });

      // clamp output bone array
      pose_bone_array.length = data_bone_array.length;

      pose_bone_array.forEach(function(bone) {
        var parent_bone = pose_bone_array[bone.parent_index];
        if (parent_bone) {
          spriter.Space.combine(parent_bone.world_space, bone.local_space, bone.world_space);
        } else {
          bone.world_space.copy(bone.local_space);
        }
      });

      var data_object_array = mainline_keyframe.object_array;
      var pose_object_array = pose.object_array;

      data_object_array.forEach(function(data_object, object_index) {
        var pose_object = pose_object_array[object_index] = (pose_object_array[object_index] || new spriter.Object());

        if (data_object instanceof spriter.ObjectRef) {
          // object is a spriter.ObjectRef, dereference
          var timeline_index = data_object.timeline_index;
          var keyframe_index = data_object.keyframe_index;
          var timeline = timeline_array[timeline_index];
          var timeline_keyframe_array = timeline.keyframe_array;
          var timeline_keyframe = timeline_keyframe_array[keyframe_index];

          var time1 = timeline_keyframe.time;
          var object1 = timeline_keyframe.object;

          pose_object.copy(object1);
          pose_object.parent_index = data_object.parent_index; // set parent from object_ref

          // see if there's something to tween with
          var keyframe_index2 = (keyframe_index + 1) % timeline_keyframe_array.length;
          if (keyframe_index !== keyframe_index2) {
            var timeline_keyframe2 = timeline_keyframe_array[keyframe_index2];
            var time2 = timeline_keyframe2.time;
            if (time2 < time1) {
              time2 = anim.length;
            }
            var object2 = timeline_keyframe2.object;

            var tween = timeline_keyframe.evaluateCurve(time, time1, time2);
            pose_object.tween(object2, tween, timeline_keyframe.spin);
          }
        } else if (data_object instanceof spriter.Object) {
          // object is a spriter.Object, copy
          pose_object.copy(data_object);
        } else {
          throw new Error();
        }
      });

      // clamp output object array
      pose_object_array.length = data_object_array.length;

      this.container.removeChildren();

      pose_object_array.forEach(function(object, idx) {
        var bone = pose_bone_array[object.parent_index];
        if (bone) {
          spriter.Space.combine(bone.world_space, object.local_space, object.world_space);
          var folder = pose.data.folder_array[object.folder_index];
          var file = folder.file_array[object.file_index];
          var offset_x = (0.5 - object.pivot.x) * file.width;
          var offset_y = (0.5 - object.pivot.y) * file.height;
          spriter.Space.translate(object.world_space, offset_x, offset_y);
        } else {
          object.world_space.copy(object.local_space);
        }

        // TODO: update object transform
        var timeline_index = data_object_array[idx].timeline_index;
        var timeline = timeline_array[timeline_index];

        var sprites = pose.entities[pose.entity_key].sprites;
        var sprite = sprites[timeline.name];
        // Apply transform
        var model = object.world_space;
        sprite.position.set(model.position.x, model.position.y);
        sprite.rotation = model.rotation.rad;
        sprite.scale.set(model.scale.x, -model.scale.y);
        sprite.alpha = object.alpha;

        pose.container.addChild(sprite);
      });
    }
  }

  /**
   * @return {number}
   * @param {Object.<string,?>|Array.<?>} json
   * @param {string|number} key
   * @param {number=} def
   */
  function loadFloat(json, key, def) {
    var value = json[key];
    switch (typeof(value)) {
      case 'string':
        return parseFloat(value);
      case 'number':
        return value;
      default:
        return def || 0;
    }
  }

  /**
   * @return {number}
   * @param {Object.<string,?>|Array.<?>} json
   * @param {string|number} key
   * @param {number=} def
   */
  function loadInt(json, key, def) {
    var value = json[key];
    switch (typeof(value)) {
      case 'string':
        return parseInt(value, 10);
      case 'number':
        return 0 | value;
      default:
        return def || 0;
    }
  }

  /**
   * @return {string}
   * @param {Object.<string,?>|Array.<?>} json
   * @param {string|number} key
   * @param {string=} def
   */
  function loadString(json, key, def) {
    var value = json[key];
    switch (typeof(value)) {
      case 'string':
        return value;
      default:
        return def || '';
    }
  }

  /**
   * @return {Array}
   * @param {*} value
   */
  function makeArray(value) {
    if ((typeof(value) === 'object') && (typeof(value.length) === 'number')) // (Object.isArray(value))
    {
      return /** @type {Array} */ (value);
    }
    if (typeof(value) !== 'undefined') {
      return [value];
    }
    return [];
  }

  /**
   * @return {number}
   * @param {number} num
   * @param {number} min
   * @param {number} max
   */
  function wrap(num, min, max) {
    if (min < max) {
      if (num < min) {
        return max - ((min - num) % (max - min));
      } else {
        return min + ((num - min) % (max - min));
      }
    } else if (min === max) {
      return min;
    } else {
      return num;
    }
  }

  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} t
   */
  function interpolateLinear(a, b, t) {
    return a + ((b - a) * t);
  }

  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} t
   */
  function interpolateQuadratic(a, b, c, t) {
      return interpolateLinear(interpolateLinear(a, b, t), interpolateLinear(b, c, t), t);
    }
  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} t
   */
  function interpolateCubic(a, b, c, d, t) {
    return interpolateLinear(interpolateQuadratic(a, b, c, t), interpolateQuadratic(b, c, d, t), t);
  }

  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} t
   */
  function tween(a, b, t) {
    return a + ((b - a) * t);
  }

  /**
   * @return {number}
   * @param {number} angle
   */
  function wrapAngleRadians(angle) {
    if (angle <= 0) {
      return ((angle - Math.PI) % (2 * Math.PI)) + Math.PI;
    } else {
      return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }
  }

  /**
   * @return {number}
   * @param {number} a
   * @param {number} b
   * @param {number} t
   * @param {number} spin
   */
  function tweenAngleRadians(a, b, t, spin) {
    if ((spin > 0) && (a > b)) {
      return a + ((b + 2 * Math.PI - a) * t); // counter clockwise
    } else if ((spin < 0) && (a < b)) {
      return a + ((b - 2 * Math.PI - a) * t); // clockwise
    }
    return a + ((b - a) * t);
  }

  /**
   * Get texture for a spriter.Object instance
   * @param  {spriter.Data} data      Spriter data instance
   * @param  {spriter.Object} object  Texture for this object
   * @return {PIXI.Texture}
   */
  function getTextureForObject(data, object) {
    var folder = data.folder_array[object.folder_index];
    var file = folder.file_array[object.file_index];
    return PIXI.utils.TextureCache[file.name];
  }

  window.spriter = spriter;

})(window.spriter || {});
