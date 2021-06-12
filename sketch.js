var ball;
var bg;
var xval=50;
var yval=50;
var bluegroup,greengroup,pinkgroup,purplegroup,yellowgroup,allgroup,shooter;
var ballarr=[],mainarr=[],newballarr=[],matchingBalls=[];
var edges;

//var greenimg,blueimg,yellowimg,pinkimg,purpleimg;

function preload (){
        //loading images
        bg=loadImage("images/background2.jpg");
        blueimg=loadImage("images/blueball.png");
        greenimg=loadImage("images/greenball.png");
        pinkimg=loadImage("images/pinkball.png");
        purpleimg=loadImage("images/purpleball.png");
        yellowimg=loadImage("images/yellowball.png");
}


function setup()
 {
        createCanvas(600,700);
        //creating groups
        allgroup=new Group();
       
        generateNewShooter();

        //making balls
        for(var r=0;r<7;r++)
        {
                for(var c=0;c<12;c++)
                {
                        ball=createSprite(xval,yval,100,100);
                        ballarr.push(ball);
                        //ball.scale=1.2;
                        // ball.debug=true;
                        ball.setCollider("circle",0,0,5)
                        var rand=Math.round(random(1,5));
                        ball.colorNum=rand;
                        allgroup.add(ball);
                        ballselect(ball,rand);
                        xval=xval+45;
               }
                xval=50;
                yval=yval+42;
                mainarr.push(ballarr);
                ballarr=[];
            //    console.log(mainarr);
        }
         lines=createSprite(600,540,1200,5);    
         lines.shapeColor="red";
 }

 function checkColorRange(r,c,colorCode)
 {
        matchingBalls=[];
        checkColumn(r,c,colorCode);
        if(matchingBalls.length>2)
        {
                for(var i=0;i<matchingBalls.length;i++)
                {
                        matchingBalls[i].destroy();
                }
        }
 }

 function checkColumn(r,c,colorCode)
 {
  var thisCol=[];       
         for(var a=r;a>=0;a--)
         {
                thisCol=mainarr[a];
                if((thisCol[c]!=null)&&(thisCol[c].colorNum===colorCode))
                {
                        matchingBalls.push(thisCol[c]);
                        checkRow(a,c,colorCode);
                }
                else
                {
                        break;
                }
         }
         for(var a=r+1;a<mainarr.length;a++)
         {
                 thisCol=mainarr[a];
                 if((thisCol[c]!=null)&&(thisCol[c].colorNum===colorCode))
                 {
                        matchingBalls.push(thisCol[c]);
                        checkRow(a,c,colorCode);
                 }
                 else
                {
                        break;
                }
         }
         //return colBalls;
         

 }

 function checkRow(r,c,colorCode)
 {
         var rowarr=[];
         rowarr=mainarr[r];
         for(var cRight=c+1;cRight<rowarr.length;cRight++)
         {
                // console.log(rowarr);
                 if((rowarr[cRight]!=null)&&(rowarr[cRight].colorNum===colorCode))
                 {
                         matchingBalls.push(rowarr[cRight]);
                 }
                 else
                 {
                         break;
                         cRight=rowarr.length; //exit for
                 }
         }
         for(var cLeft=c-1;cLeft>=0;cLeft--)
         {
                 if((rowarr[cLeft]!=null)&&(rowarr[cLeft].colorNum===colorCode))
                 {
                        matchingBalls.push(rowarr[cLeft]);
                }
                else
                {
                        break;
                        cLeft=-1; //exit for
                }
         }
 }

 
 function generateNewShooter()
 {
        shooter=createSprite(300,510,10,10);
        shooter.debug=true;
        shooter.setCollider("circle",0,0,12)
        var randm=Math.round(random(1,5));
        ballselect(shooter,randm);
        shooter.colorNum=randm;
       
 }

function draw()
 {
  background(bg);

  //making line
  push();
  stroke(255,550,0);
  strokeWeight(19);
  //line(0,438,600,438);
  pop();
  
  fill("blue");
  textSize(50);
  //stroke(15);
  strokeWeight(10);
  textFont("Algerian")
  text("Bubble Shooter",90,600)
  
  fill("blue");
  textSize(20);
  //stroke(15);
  strokeWeight(10);
  textFont("Algerian")
  text("Shoot As more bubbles as you can!!!",100,630)

  if(shooter==null)
  {
          generateNewShooter();
  }  
  if (mouseWentUp("leftButton")) {
        //console.log("here");
        angle=(180/Math.PI)*Math.atan2(mouseY-shooter.y, mouseX-shooter.x);
        shooter.setSpeedAndDirection(10, angle);
      }
  fill("black");
  //console.log(mainarr.length)
  if(allgroup.isTouching(shooter))
  { 
          allgroup.add(shooter);
  for(var r=mainarr.length-1;r>=0;r--)
  {
          ballarr=mainarr[r];
          //console.log(ballarr)
          for(var c=0;c<ballarr.length;c++)
          {
                  //console.log(ballarr[c]);
                  if((ballarr[c]!=null)&&(shooter.isTouching(ballarr[c])))
                  {
                        shooter.setVelocity(0,0);
                        shooter.y=ballarr[c].y+45;
                          shooter.x=ballarr[c].x;
                          if(r===mainarr.length-1) //check if new row of ball need to be created
                          {
                                  newballarr=[];
                                  newballarr.length=ballarr.length;
                                  newballarr[c]=shooter;
                                  mainarr.push(newballarr);
                                  checkColorRange(mainarr.length-1,c,shooter.colorNum);
                          }
                          else
                          {
                                  newballarr=mainarr[r+1];
                                  newballarr[c]=shooter;
                                  mainarr[r+1]=newballarr;
                                  checkColorRange(r+1,c,shooter.colorNum);
                          }
                          
                  }
          }
  }
  shooter=null;
}
  edges=createEdgeSprites();
  if (shooter!==null){
  shooter.bounceOff(edges);
  }


  
       if (frameCount%250===0)
       {
               allgroup.setVelocityYEach(3)
       }
       else{
               allgroup.setVelocityYEach(0)
      
       }

       if(allgroup.isTouching(lines)&&shooter!==null)
       {
               console.log("bye time");
               allgroup.destroyEach();
               shooter.destroy();

       //        text("Game Over",200,200);
       }
     
        drawSprites();
 
}
function ballselect(ball,rand)
{
        switch(rand)
        {
          case 1: ball.addImage(blueimg);
                 ball.scale=0.29;
                  break;
          case 2: ball.addImage(greenimg);
                  ball.scale=0.29;
                  break;
          case 3: ball.addImage(pinkimg);
                  ball.scale=0.29;
                  break;
          case 4: ball.addImage(purpleimg);
                  ball.scale=0.29;
                  break;
          case 5: ball.addImage(yellowimg);
                  ball.scale=0.29;
                  break;
                  
        }       
}