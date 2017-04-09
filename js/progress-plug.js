(function($){
    function angleToRadian( angle ) {
        return Math.PI / 180 * angle;
    }
    function Circle(x,y,r,begin,over,fillStyle,strokeStyle,lineWidth){
        this.x=x;
        this.y=y;
        this.r=r;
        this.begin=begin;
        this.over=over;
        this.lineWidth=lineWidth;
        this.strokeStyle=strokeStyle;
        this.fillStyle=fillStyle;
    }
    Circle.prototype.draw=function(ctx){
        ctx.beginPath();
        ctx.lineWidth=this.lineWidth;
        ctx.arc(this.x,this.y,this.r,this.begin,this.over);
        ctx.strokeStyle=this.strokeStyle;
        ctx.fillStyle=this.fillStyle;
        ctx.stroke();
    }
    function Rect(x,y,width,height,lineWidth,strokeStyle,fillStyle){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.lineWidth=lineWidth;
        this.strokeStyle=strokeStyle;
        this.fillStyle=fillStyle;
    }
    Rect.prototype.draw=function(ctx){
        ctx.beginPath();
        ctx.lineWidth=this.lineWidth;
        ctx.rect(this.x,this.y,this.width,this.height);
        ctx.strokeStyle=this.strokeStyle;
        ctx.fillStyle=this.fillStyle;
        ctx.fill();
    }

    $.fn.progress=function(opt){
        var setting= $.extend({
            width:380,
            height:380,
            r:140,
            backgroundColor:'red',
            backColorLineWidth:15,
            progressColor:'green',
            progressLineWidth:16,
            textStyle:'#F75845',
            progressRotate:0,
            progressBegin:-90,
            speed:3,
            countHour:50,
            widthRect: 35,
            heightRect:20,
            time:false
        },opt)

        return this.each(function(){
            var progress=$(this)
            var c=document.createElement('canvas')
            c.setAttribute('id','canvas')
            c.setAttribute('width',setting.width)
            c.setAttribute('height',setting.height)
            var ctx=c.getContext("2d");

            if(setting.time===true){
                progress.append('<div class="progress"></div>')
                $('.progress').append(c)
                $('.progress').append('<div class="time"><span>0</span> <span>0</span> <span>:</span> <span>0</span> <span>0</span> <span>:</span> <span>0</span> <span>0</span> </div>')
                var timeSpans =$('.time>span')
                var date=new Date();
                var hour=date.getHours();
                var mins=date.getMinutes();
                var secs=date.getSeconds();
                timeSpans.eq(0).html(Math.floor(hour/10))
                timeSpans.eq(1).html(hour%10)
                timeSpans.eq(3).html(Math.floor(mins/10))
                timeSpans.eq(4).html(mins%10)
                timeSpans.eq(6).html(Math.floor(secs/10))
                timeSpans.eq(7).html(secs%10)
            }else{
                progress.append(c)
            }

            var x=setting.width/2;
            var y=setting.height/2;

            var timeID=setInterval(function(){
                ctx.clearRect(0,0,c.width,c.height);
                var backgCircle=new Circle(x,y,setting.r,0,2*Math.PI,setting.backgroundColor,setting.backgroundColor,setting.backColorLineWidth);
                backgCircle.draw(ctx);
                if(setting.time===true){
                    var date=new Date();
                    var hour=date.getHours();
                    setting.countHour=Math.floor(hour/24*100)
                }
                var rotate=setting.progressRotate*3.6+setting.progressBegin

                var pointX=x-12+(setting.r+25)*Math.cos(angleToRadian(rotate));
                var pointY=y+2+(setting.r+25)*Math.sin(angleToRadian(rotate));

                if(setting.progressRotate<setting.countHour){
                    if(setting.progressRotate<50){
                        progressCircle(pointX+2,pointY-10,pointX+4,pointY+4,setting.progressBegin,rotate,setting.progressRotate)
                    }else{
                        progressCircle(pointX-10,pointY-10,pointX-6,pointY+4,setting.progressBegin,rotate,setting.progressRotate)
                    }
                }else{
                    setting.progressRotate=setting.countHour;
                    if(setting.progressRotate<50){
                        progressCircle(pointX+2,pointY-10,pointX+4,pointY+4,setting.progressBegin,rotate,setting.progressRotate)
                        clearInterval(timeID);
                    }else{
                        progressCircle(pointX-10,pointY-10,pointX-6,pointY+4,setting.progressBegin,rotate,setting.progressRotate)
                        clearInterval(timeID);
                    }
                }
                setting.progressRotate+=setting.speed;//滚动进度条
            },50)
            function progressCircle(RectX,RectY,fillX,fillY,rotate,percent,text){
                var progressCircle=new Circle(x,y,setting.r,angleToRadian(rotate),angleToRadian(percent),setting.progressColor,setting.progressColor,setting.progressLineWidth);
                progressCircle.draw(ctx);
                var rect=new Rect(RectX,RectY,setting.widthRect,setting.heightRect);
                rect.draw(ctx);
                ctx.beginPath();
                ctx.fillStyle=setting.textStyle;
                ctx.fillText(text+'%',fillX,fillY);
            }
        })
    }
}(jQuery))