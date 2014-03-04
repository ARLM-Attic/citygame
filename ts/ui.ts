/// <reference path="../js/lib/pixi.d.ts" />
/// <reference path="../js/lib/tween.js.d.ts" />

class UIObject extends PIXI.DisplayObjectContainer
{
  timeouts: any = {};

  constructor(
    public _parent: PIXI.DisplayObjectContainer,
    public delay: number,
    public lifeTime: number
    )
  {
    super();
    this.visible = false;

    this.init()
    
  }
  init()
  {
    this._parent.addChild(this);

    var self = this;
    self.timeouts["add"] = window.setTimeout(
      function UIObjectAddFN()
      {
        self.visible = true;

        if (self.lifeTime > 0)
        {
          self.timeouts["remove"] = window.setTimeout(
            function UIObjectRemoveFN()
            {
              self.remove();
            }, self.lifeTime)
        }
      }, self.delay)
  }
  remove()
  {
    this.clearTimeouts();
    if (this.parent)
    {
      this.parent.removeChild(this);
    }
  }
  clearTimeouts()
  {
    for (var timeout in this.timeouts)
    {
      window.clearTimeout( this.timeouts[timeout] );
    }
  }
}

class ToolTip extends UIObject
{
  topLeftCorner: number[];

  constructor(
    public _parent: PIXI.DisplayObjectContainer,
    public delay: number,
    public lifeTime: number,
    public data: any
    )
  {
    super(_parent, delay, lifeTime);

    this.drawToolTip(data);

    super.init();
  }
  drawToolTip(data: any)
  {
    var lineStyle = data.lineStyle ||
    {
      width: 0,
      color: 0x000000,
      alpha: 1
    };
    var fillStyle = data.fillStyle ||
    {
      color: 0xFFFFFF,
      alpha: 1
    }
    var width = data.width || 200;
    var height = data.height || 100;
    var tipPos = data.tipPos || 0.25;
    var tipWidth = data.tipWidth || 10;
    var tipHeight = data.tipHeight || 20;    
    var tipDir = data.tipDir || "right";


    var textObject = new PIXI.Text(data.text.text, data.text.font);

    //temp
    if (data.autoSize)
    {
      width = textObject.width + data.text.padding[0] * 2;
      height = textObject.height + data.text.padding[1] * 2;
    }

    var speechPoly = makeSpeechRect(width, height, tipPos,
    tipWidth, tipHeight, tipDir);
    this.topLeftCorner = speechPoly[1];

    var gfx = new PIXI.Graphics();
    this.addChild(gfx);

    drawPolygon(gfx, speechPoly[0], lineStyle, fillStyle);

    

    this.setTextPos(textObject, data.text.padding);
    gfx.addChild(textObject);

  }
  setTextPos(text: PIXI.Text, padding: number[])
  {
    var x = this.topLeftCorner[0] + padding[0];
    var y = this.topLeftCorner[1] + padding[1];

    text.position.set(x, y)
    return text;
  }
}

function drawPolygon(gfx: PIXI.Graphics,
  polygon: number[][],
  lineStyle: any,
  fillStyle: any)
{
  gfx.lineStyle(lineStyle.width, lineStyle.color, lineStyle.alpha);
  gfx.beginFill(fillStyle.color, fillStyle.alpha);
  
  gfx.moveTo(polygon[0][0], polygon[0][1]);
  for (var i = 1; i < polygon.length; i++)
  {
    var x = polygon[i][0];
    var y = polygon[i][1];
    gfx.lineTo(x, y);
  }
  gfx.endFill();
  return gfx;
}

function makeSpeechRect(width = 200, height = 100,
  tipPos = 0.25, tipWidth = 10, tipHeight = 20,
  tipDir = "right", pointing = "down") : any[]
{
  var xMax = width * ( 1-tipPos );
  var yMax = height + tipHeight;
  var xMin = -width * tipPos;
  var yMin = tipHeight

  var resultPolygon;

  if (pointing = "down")
  {
    resultPolygon =
    [
      [0, 0],
      [tipWidth, -yMin],
      [xMax, -yMin],
      [xMax, -yMax],
      [xMin, -yMax],
      [xMin, -yMin],
      [0, -yMin],
      [0, 0],
    ];
  }
  else if (pointing = "up")
  {

  }

  if (tipDir === "right")
  {
    resultPolygon[1][0] = tipWidth;
    resultPolygon[6][0] = 0;

    /*
    resultPolygon =
    [
      [0, 0],
      [tipWidth, -yMin],
      [xMax, -yMin],
      [xMax, -yMax],
      [xMin, -yMax],
      [xMin, -yMin],
      [0, -yMin],
      [0, 0],
    ];
    */
  }
  else if (tipDir === "left")
  {

    resultPolygon[1][0] = 0;
    resultPolygon[6][0] = -tipWidth;
    /*
    resultPolygon =
    [
      [0, 0],
      [0, -yMin],
      [xMax, -yMin],
      [xMax, -yMax],
      [xMin, -yMax],
      [xMin, -yMin],
      [-tipWidth, -yMin],
      [0, 0],
    ];
    */
  }


  return [resultPolygon, [xMin, -yMax] ]; //[0]: polygon, [1]: top left
}

/*
class UIDrawer
{
  layer: PIXI.DisplayObjectContainer;
  fonts: any = {};
  active: UIObject;

  constructor()
  {
    this.layer = game.layers["tooltips"];
    this.init();
  }
  init()
  {
    this.registerFont( "base",
    {
      font: "12px Snippet",
      fill: "#61696B",
      align: "left",
    });
  }

  registerFont( name: string, fontObject: any )
  {
    this.fonts[name] = fontObject;
  }

  addText( text: string, font: string )
  {
    if (this.active)
    {
      this.active.remove();
      this.active = undefined;
    }
    var container = this.active = new UIObject( this.layer, 300, -1);

    var gfx = new PIXI.Graphics();
    container.addChild(gfx);
    gfx.lineStyle(2, 0x587982, 1);
    gfx.beginFill(0xE8FBFF, 0.8);

    gfx.moveTo(0, 0);
    gfx.lineTo(10, -20);
    gfx.lineTo(150, -20);
    gfx.lineTo(150, -120);
    gfx.lineTo(-50, -120);
    gfx.lineTo(-50, -20);
    gfx.lineTo(0, -20);
    gfx.lineTo(0, 0);
    gfx.endFill();
    

    var textObject = new PIXI.Text(text, this.fonts[font]);
    textObject.position.set(-40, -110)
    container.addChild(textObject);
    return container;
  }
  removeObject( uiObject: PIXI.DisplayObject )
  {
    //this.layer.removeChild( uiObject );
  }
  addFadeyText( text: string, font: string,
    timeout: number, delay: number )
  {
    var uiObject = this.addText(text, font);
    return uiObject;
  }
  clearLayer()
  {
    for (var i = this.layer.children.length - 1; i >= 0; i--)
    {
      this.layer.removeChild(this.layer.children[i]);
    }
  }
}
*/