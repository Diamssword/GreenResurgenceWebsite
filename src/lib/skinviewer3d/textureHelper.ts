import type { Color } from "three";

export type eyeType="2*2"|"2*3"|"2*4"|"3*4"|"none"
export function moveBrows(canvas:HTMLCanvasElement,fleshCanvas:HTMLCanvasElement|undefined, type:eyeType)
{
    var ctx=canvas?.getContext("2d");
    var ctx1=fleshCanvas?.getContext("2d");
    if(!ctx)
        return;
    if(type=="2*2")
    {
        var B=ctx.getImageData(16,22,16,2)
        ctx.putImageData(B,112,6);
        if(ctx1)
        {
            ctx1.clearRect(112,0,16,8)
            var p=ctx1.getImageData(16,22,16,2);
            ctx1.putImageData(p,112,4)
        }
        
    }
    else if(type=="2*4" || "3*4"|| "2*3")
    {
        var A=ctx.getImageData(16,17,16,15)
        ctx.clearRect(16,17,16,15);
        ctx.putImageData(A,16,16);
        var B=ctx.getImageData(16,21,16,2)
        ctx.putImageData(B,112,2);
        if(ctx1)
        {
            ctx1.clearRect(112,0,16,8)
            var p=ctx1.getImageData(16,21,16,2);
            ctx1.putImageData(p,112,0)
        }
    }
    
    
}
export function moveEyes(canvas:HTMLCanvasElement,fleshCanvas:HTMLCanvasElement|undefined, type:eyeType)
{
    var ctx=canvas.getContext("2d");
    var ctx1=fleshCanvas?.getContext("2d");
    if(!ctx)
        return;
    if(ctx1)
        ctx1.clearRect(48,0,16,16)
        ctx.clearRect(48,0,16,16)
    if(type=="2*2")
    {
        var G=ctx.getImageData(19,24,3,2)
        ctx.putImageData(G,48,14);
        var D=ctx.getImageData(26,24,3,2)
        ctx.putImageData(D,51,14);
        if(ctx1)
        {
            var d=ctx1.getImageData(19,24,3,2)    
            ctx1.putImageData(d,56,14)
            var d=ctx1.getImageData(26,24,3,2)    
            ctx1.putImageData(d,59,14)
        }
        
    }
    else if(type=="2*4")
    {
        var G=ctx.getImageData(19,23,3,4)
        ctx.putImageData(G,48,10);
        var D=ctx.getImageData(26,23,3,4)
        ctx.putImageData(D,51,10);
        if(ctx1)
        {
            var d=ctx1.getImageData(19,23,3,4)    
            ctx1.putImageData(d,56,10)
            var d=ctx1.getImageData(26,23,3,4)    
            ctx1.putImageData(d,59,10)
        }
    }
    else if(type=="3*4")
    {
        var G=ctx.getImageData(18,23,4,4)
            ctx.putImageData(G,48,6);
        var D=ctx.getImageData(26,23,4,4)
            ctx.putImageData(D,52,6);        
        if(ctx1)
        {
            var d=ctx1.getImageData(18,23,4,4)    
            ctx1.putImageData(d,56,6)
            var d=ctx1.getImageData(26,23,4,4)    
            ctx1.putImageData(d,60,6)
        }
    }
    else if(type=="2*3")
    {
            var G=ctx.getImageData(19,23,3,3)
                ctx.putImageData(G,48,3);
            var D=ctx.getImageData(26,23,3,3)
                ctx.putImageData(D,51,3);               
            if(ctx1)
            {
                var d=ctx1.getImageData(19,23,3,3)    
                ctx1.putImageData(d,56,3)
                var d=ctx1.getImageData(26,23,3,3)    
                ctx1.putImageData(d,59,3)
            }
    }
    
}

export function copyColorCanvas(canvas:HTMLCanvasElement,color:Color)
{
    var ca1=document.createElement("canvas")
    var ca2=document.createElement("canvas")
    ca1.width=ca2.width=canvas.width;
    ca1.height=ca2.height=canvas.height;
    var ctx1=ca1.getContext("2d");
    var ctx2=ca2.getContext("2d");
    if(ctx1 && ctx2)
    {
        ctx1.drawImage(canvas,0,0);
        ctx1.globalCompositeOperation='source-atop';
        ctx1.fillStyle="#"+color.getHexString();
        ctx1.fillRect(0,0,canvas.width,canvas.height);  
        ctx1.globalCompositeOperation='source-over';
        ctx2.drawImage(canvas,0,0);
        ctx2.globalCompositeOperation='color';

        ctx2.drawImage(ca1,0,0);
        ctx2.globalCompositeOperation='source-over';
        ctx2.save()        
    }
    return ca2;
}
export function colorCanvas(canvas:HTMLCanvasElement,color:Color)
{
    var ca1=document.createElement("canvas")
    ca1.width=canvas.width;
    ca1.height=canvas.height;
    var ctx1=ca1.getContext("2d");
    var ctx2=canvas.getContext("2d");
    if(ctx1 && ctx2)
    {
        ctx1.drawImage(canvas,0,0);
        ctx1.globalCompositeOperation='source-atop';
        ctx1.fillStyle="#"+color.getHexString();
        ctx1.fillRect(0,0,canvas.width,canvas.height);  
        ctx1.globalCompositeOperation='source-over';
        ctx2.drawImage(canvas,0,0);
        ctx2.globalCompositeOperation='multiply'; //multiply fait un rendu proche du jeux, mais trop sombre

        ctx2.drawImage(ca1,0,0);
        ctx2.globalCompositeOperation='source-over';
        ctx2.save()        
    }
    return canvas;
}