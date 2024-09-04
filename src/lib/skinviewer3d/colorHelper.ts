import type { Color } from "three";

export type eyeType="4*4"|"4*2"|"5*4"|"3*2"|"none"
export function moveEyes(canvas:HTMLCanvasElement,fleshCanvas:HTMLCanvasElement|undefined, type:eyeType)
{
    var ctx=canvas.getContext("2d");
    var ctx1=fleshCanvas?.getContext("2d");
    if(!ctx)
        return;
    if(type=="4*2")
    {
        var G=ctx.getImageData(18,24,4,2)
            ctx.putImageData(G,48,8);
        var D=ctx.getImageData(26,24,4,2)
            ctx.putImageData(D,52,8);
        var B=ctx.getImageData(18,22,4,2)
            ctx.putImageData(B,120,6);
            B=ctx.getImageData(26,22,4,2)
            ctx.putImageData(B,124,6);
            if(ctx1){
                //chair cover oeil
                var p=ctx1.getImageData(18,24,4,2);
                ctx.putImageData(p,48,6)
                p=ctx1?.getImageData(26,24,4,2);
                ctx?.putImageData(p,52,6)
                //chair cover sourcil
                var p=ctx1.getImageData(18,22,4,2);
                ctx.putImageData(p,120,4)
                p=ctx1?.getImageData(26,22,4,2);
                ctx?.putImageData(p,124,4)
            }
        
    }
    else if(type=="3*2")
    {
        var G=ctx.getImageData(18,24,3,2)
        ctx.putImageData(G,56,8);
    var D=ctx.getImageData(27,24,4,2)
        ctx.putImageData(D,59,8);
    var B=ctx.getImageData(18,22,4,2)
        ctx.putImageData(B,120,6);
        B=ctx.getImageData(26,22,4,2)
        ctx.putImageData(B,124,6);
        if(ctx1){
            //chair cover oeil
            var p=ctx1.getImageData(18,24,3,2);
            ctx.putImageData(p,56,6)
            p=ctx1?.getImageData(27,24,3,2);
            ctx?.putImageData(p,59,6)
            //chair cover sourcil
            var p=ctx1.getImageData(18,22,4,2);
            ctx.putImageData(p,120,4)
            p=ctx1?.getImageData(26,22,4,2);
            ctx?.putImageData(p,124,4)
        }
    }
    else if(type=="4*4")
    {
        var G=ctx.getImageData(18,22,4,4)
            ctx.putImageData(G,48,12);
        var D=ctx.getImageData(26,22,4,4)
            ctx.putImageData(D,52,12);
        var B=ctx.getImageData(18,20,4,2)
            ctx.putImageData(B,120,2);
            B=ctx.getImageData(26,20,4,2)
            ctx.putImageData(B,124,2);
            if(ctx1){
                //chair cover oeil
                var p=ctx1.getImageData(18,23,4,2);
                ctx.putImageData(p,48,10)
                p=ctx1?.getImageData(26,23,4,2);
                ctx?.putImageData(p,52,10)
                //chair cover sourcil
                var p=ctx1.getImageData(18,20,4,2);
                ctx.putImageData(p,120,0)
                p=ctx1?.getImageData(26,20,4,2);
                ctx?.putImageData(p,124,0)
            }
        
    }
    else if(type=="5*4")
        {
            var G=ctx.getImageData(17,22,5,4)
                ctx.putImageData(G,56,12);
            var D=ctx.getImageData(26,22,5,4)
                ctx.putImageData(D,61,12);
            var B=ctx.getImageData(18,20,4,2)
                ctx.putImageData(B,120,2);
                B=ctx.getImageData(26,20,4,2)
                ctx.putImageData(B,124,2);
                if(ctx1){
                    //chair cover oeil
                    var p=ctx1.getImageData(17,23,5,2);
                    ctx.putImageData(p,56,10)
                    p=ctx1?.getImageData(26,23,5,2);
                    ctx?.putImageData(p,61,10)
                    //chair cover sourcil
                    var p=ctx1.getImageData(18,20,4,2);
                    ctx.putImageData(p,120,0)
                    p=ctx1?.getImageData(26,20,4,2);
                    ctx?.putImageData(p,124,0)
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