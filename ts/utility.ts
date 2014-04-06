/// <reference path="../lib/pixi.d.ts" />

function getFrom2dArray(target, arr: number[]): any
{
  var result = [];
  for (var i = 0; i < arr.length; i++)
  {
    if 
    ( 
      (arr[i][0] >= 0 && arr[i][0] < target.length) &&
      (arr[i][1] >= 0 && arr[i][1] < target.length)
    )
    {
      result.push( target[arr[i][0]][arr[i][1]] );
    }

  };
  return result;
}

function getRandomKey( target )
{
  var _targetKeys = Object.keys(target);
  var _rnd = Math.floor(Math.random() * (_targetKeys.length));
  return _targetKeys[_rnd];
}

function getRandomProperty( target )
{
  var _rndProp = target[ getRandomKey(target) ];
  return _rndProp;
}

function getRandomArrayItem( target: any[] )
{
  var _rnd = Math.floor(Math.random() * (target.length));
  return target[_rnd];
}

function setDeepProperties(baseObj, target: any[], props)
{
  if (target.length <= 0)
  {
    for (var prop in props)
    {
      baseObj[prop] = props[prop];
    }
    return baseObj;
  }

  else
  {
    var targetProp = target.shift();

    if ( !baseObj.hasOwnProperty(targetProp) )
    {
      baseObj[targetProp] = {};
    }
    var newBaseObj = baseObj[targetProp];

    return setDeepProperties(newBaseObj, target, props)
  }
}

function deepDestroy(object)
{
  if (object.texture)
  {
    object.texture.destroy(true);
  }

  if ( !object.children || object.children.length <= 0)
  {
    return;
  }
  else
  {
    for (var i = 0; i < object.children.length; i++)
    {
      deepDestroy(object.children[i]);
    }
  }
}

function rectToIso(width: number, height: number)
{
  var top = [width/2, 0];
  var right = [width, height/2];
  var bot = [width/2, height];
  var left = [0, height/2];

  return [top, right, bot, left];
}

function getOrthoCoord(click: number[], tileSize: number[], worldSize: number[])
{
  var tileX = click[0] / tileSize[0] + click[1] / tileSize[1] - worldSize[0] / 2;
  var tileY = click[1] / tileSize[1] - click[0] / tileSize[0] + worldSize[1] / 2;

  return [Math.floor(tileX), Math.floor(tileY)];
}

function getIsoCoord(x: number, y: number,
  width: number, height: number,
  offset?: number[])
{
  var _w2 = width / 2;
  var _h2 = height / 2;
  var _isoX = (x - y) * _w2;
  var _isoY = (x + y) * _h2;
  if (offset)
  { 
    _isoX += offset[0];
    _isoY += offset[1];
  }
  return [_isoX, _isoY];
}

function getTileScreenPosition(x: number, y:number, tileSize: number[], worldSize: number[],
  container: PIXI.DisplayObjectContainer)
{
  var wt = container.worldTransform;
  var zoom = wt.a;
  var offset = [wt.tx + worldSize[0]/2 * zoom,
    wt.ty + tileSize[1]/2 * zoom];
  tileSize[0] *= zoom;
  tileSize[1] *= zoom;

  console.log(getIsoCoord(x, y, tileSize[0], tileSize[1], offset));
}

function randInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDice(dice, sides)
{
  var total = 0;
  for (var i = 0; i < dice; i++)
  {
    total += randInt(1, sides);
  }
  return total;
}

1   5
3   8
5   11
7   14
9   17