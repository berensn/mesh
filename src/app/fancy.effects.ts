/*
// Class used for javascript effects on background and navigation
import { Globals } from './globals';
import * as PIXI from 'pixi.js';

export class FancyEffects{
  constructor(private _g: Globals){}

  // Formatting and on/off values for console.log
  loc = this._g.loc;        // Location color
  item = this._g.item;      // Item color
  val = this._g.val;        // Value color
  log = this._g.log;        // Logging on/off 

  wtf(){
    if (this.log) console.log('%c[fancy.effects.ts] %cfancy test', this.loc, this.val);
  }

  distortion(){
    (function(){
    
      window.CanvasSlideshow = function( options ){

        //  SCOPE
        /// ---------------------------   
        var that  =   this;

        //  OPTIONS
        /// ---------------------------      
        options                     = options || {};
        options.stageWidth          = options.hasOwnProperty('stageWidth') ? options.stageWidth : 1920;
        options.stageHeight         = options.hasOwnProperty('stageHeight') ? options.stageHeight : 1080;
        options.pixiSprites         = options.hasOwnProperty('sprites') ? options.sprites : [];
        options.texts               = options.hasOwnProperty('texts') ? options.texts : [];
        options.autoPlay            = options.hasOwnProperty('autoPlay') ? options.autoPlay : true;
        options.autoPlaySpeed       = options.hasOwnProperty('autoPlaySpeed') ? options.autoPlaySpeed : [10, 3];
        options.fullScreen          = options.hasOwnProperty('fullScreen') ? options.fullScreen : true;
        options.displaceScale       = options.hasOwnProperty('displaceScale') ? options.displaceScale : [200, 70];
        options.displacementImage   = options.hasOwnProperty('displacementImage') ? options.displacementImage : '../img/clouds.jpg';
        options.navElement          = options.hasOwnProperty('navElement')  ?  options.navElement : document.querySelectorAll( '.scene-nav' ); 
        options.displaceAutoFit     = options.hasOwnProperty('displaceAutoFit')  ?  options.displaceAutoFit : false; 
        options.wacky               = options.hasOwnProperty('wacky') ? options.wacky : false;
        options.interactive         = options.hasOwnProperty('interactive') ? options.interactive : false;
        options.interactionEvent    = options.hasOwnProperty('interactionEvent') ? options.interactionEvent : '';
        options.displaceScaleTo     = (options.autoPlay === false) ? [0, 0] : [20, 20];
        options.textColor           = options.hasOwnProperty('textColor') ? options.textColor : '#fff';
        options.displacementCenter  = options.hasOwnProperty('displacementCenter') ? options.displacementCenter : false;
        options.dispatchPointerOver = options.hasOwnProperty('dispatchPointerOver') ? options.dispatchPointerOver : false;
        
        //  PIXI VARIABLES
        /// ---------------------------    
        var renderer            = PIXI.autoDetectRenderer(options.stageWidth, options.stageHeight, {transparent: true});
        var stage               = new PIXI.Container();
        var container           = new PIXI.Container();
        var displacementSprite  = PIXI.Sprite.fromImage(options.displacementImage);
        var displacementFilter  = new PIXI.filters.DisplacementFilter(displacementSprite);

        /// ---------------------------
        //  INITIALISE PIXI
        /// ---------------------------      
        this.initPixi = function() {

          // Add canvas to the HTML
          document.body.appendChild( renderer.view );
    
          // Add child container to the main container 
          stage.addChild(container);
    
          // Fit renderer to the screen
          if (options.fullScreen === true){
            renderer.view.style.objectFit = 'cover';
            renderer.view.style.width     = '100%';
            renderer.view.style.height    = '100%';
            renderer.view.style.top       = '50%';
            renderer.view.style.left      = '50%';
            renderer.view.style.webkitTransform = 'translate( -50%, -50% ) scale(1.2)';
            renderer.view.style.transform = 'translate( -50%, -50% ) scale(1.2)';     
          }else{
            renderer.view.style.maxWidth  = '100%';
            renderer.view.style.top       = '50%';
            renderer.view.style.left      = '50%';
            renderer.view.style.webkitTransform = 'translate( -50%, -50% )';
            renderer.view.style.transform = 'translate( -50%, -50% )';          
          }
            
          displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

          // Set the filter to stage and set some default values for the animation
          stage.filters = [displacementFilter];        

          if (options.autoPlay === false){
            displacementFilter.scale.x = 0;
            displacementFilter.scale.y = 0;
          }

          if (options.wacky === true){

            displacementSprite.anchor.set(0.5);
            displacementSprite.x = renderer.width / 2;
            displacementSprite.y = renderer.height / 2; 
          }

          displacementSprite.scale.x = 2;
          displacementSprite.scale.y = 2;
    
          // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
          displacementFilter.autoFit = options.displaceAutoFit;
          
          stage.addChild(displacementSprite);
        };

        /// ---------------------------
        //  DEFAULT RENDER/ANIMATION
        /// ---------------------------        
        if (options.autoPlay === true){

          var ticker = new PIXI.ticker.Ticker();

          ticker.autoStart = options.autoPlay;

          ticker.add(function( delta ){
            
            displacementSprite.x += options.autoPlaySpeed[0] * delta;
            displacementSprite.y += options.autoPlaySpeed[1];
            
            renderer.render( stage );
          });
        }else{

            var render = new PIXI.ticker.Ticker();

            render.autoStart = true;

            render.add(function( delta ){
              renderer.render( stage );
            });
        }    
        
        /// ---------------------------
        //  INIT FUNCTIONS
        /// ---------------------------     
        this.init = function(){
          
          that.initPixi();
          that.loadPixiSprites(options.pixiSprites);
        };
    
        /// ---------------------------
        //  CENTER DISPLACEMENT
        /// ---------------------------
        if (options.displacementCenter === true){
          displacementSprite.anchor.set(0.5);
          displacementSprite.x = renderer.view.width / 2;
          displacementSprite.y = renderer.view.height / 2;        
        }      
        
        /// ---------------------------
        //  START 
        /// ---------------------------           
        this.init();
        
        /// ---------------------------
        //  HELPER FUNCTIONS
        /// ---------------------------
        function scaleToWindow(canvas, backgroundColor){
          var scaleX, scaleY, scale, center;
        
          //1. Scale the canvas to the correct size
          //Figure out the scale amount on each axis
          scaleX = window.innerWidth / canvas.offsetWidth;
          scaleY = window.innerHeight / canvas.offsetHeight;
        
          //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
          scale = Math.min(scaleX, scaleY);
          canvas.style.transformOrigin = "0 0";
          canvas.style.transform = "scale(" + scale + ")";
        
          //2. Center the canvas.
          //Decide whether to center the canvas vertically or horizontally.
          //Wide canvases should be centered vertically, and 
          //square or tall canvases should be centered horizontally
          if (canvas.offsetWidth > canvas.offsetHeight){
            if (canvas.offsetWidth * scale < window.innerWidth){
              center = "horizontally";
            }else{
              center = "vertically";
            }
          }else{
            if (canvas.offsetHeight * scale < window.innerHeight){
              center = "vertically";
            }else{
              center = "horizontally";
            }
          }
        
          //Center horizontally (for square or tall canvases)
          var margin;
          if (center === "horizontally"){
            margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
            canvas.style.marginTop = 0 + "px";
            canvas.style.marginBottom = 0 + "px";
            canvas.style.marginLeft = margin + "px";
            canvas.style.marginRight = margin + "px";
          }
        
          //Center vertically (for wide canvases) 
          if (center === "vertically"){
            margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
            canvas.style.marginTop = margin + "px";
            canvas.style.marginBottom = margin + "px";
            canvas.style.marginLeft = 0 + "px";
            canvas.style.marginRight = 0 + "px";
          }
        
          //3. Remove any padding from the canvas  and body and set the canvas
          //display style to "block"
          canvas.style.paddingLeft = 0 + "px";
          canvas.style.paddingRight = 0 + "px";
          canvas.style.paddingTop = 0 + "px";
          canvas.style.paddingBottom = 0 + "px";
          canvas.style.display = "block";
        
          //4. Set the color of the HTML body background
          document.body.style.backgroundColor = backgroundColor;
        
          //Fix some quirkiness in scaling for Safari
          var ua = navigator.userAgent.toLowerCase();
          if (ua.indexOf("safari") != -1){
            if (ua.indexOf("chrome") > -1){
              // Chrome
            }else{
              // Safari
              //canvas.style.maxHeight = "100%";
              //canvas.style.minHeight = "100%";
            }
          }
        
          //5. Return the `scale` value. This is important, because you'll need this value 
          //for correct hit testing between the pointer and sprites
          return scale;
        } // http://bit.ly/2y1Yk2k           
      };
    })(); 
  }
}*/