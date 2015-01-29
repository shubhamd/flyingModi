

var game = new Phaser.Game(320,514,Phaser.AUTO,'game_div');
var c=0;
var userName =0  ;
var main_state={

	preload:function(){
		this.game.stage.backgroundColor='#0B0B61';
		var text = "Loading....";
		var text1 = "SpaceBar/MouseClick : Jump";
		var style = { font: "30px Arial",fill:"#ffffff",align:"center"};
	
	
		var style1 = { font: "20px Arial",fill:"#ffffff",align:"center"};
		

		
		
		
		this.game.load.image('gameOver_image','assets/gameOver.png');
		this.game.add.text(game.world.centerX-100,50,text,style);
		this.game.add.text(game.world.centerX-120,150,text1,style1);

        		
		this.game.load.image('bird','assets/bird.png');
		
		this.game.load.image('bird1','assets/bird1.png');
		this.game.load.image('background','assets/background.jpg');
		this.game.load.image('background1','assets/background1.jpg');	
		this.game.load.image('score_image','assets/score.png');
		
		this.game.load.image('pipe','assets/pipe.png');
		this.game.load.audio('jump', 'assets/jump.wav');
		this.game.load.audio('collide','assets/collide.wav');

	},

	create:function(){

		game.stage.scale.startFullScreen();
		game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL; //resize your window to see the stage resize too
		game.stage.scale.setShowAll();
		game.stage.scale.refresh();

		this.jump_sound = this.game.add.audio('jump');
		this.collide_sound=this.game.add.audio('collide');
		
		var bgNum = Math.floor(Math.random()*2);			//Load background randomly
		if(bgNum==0){
			this.game.add.sprite(0,0,'background');
			//this.bird=this.game.add.sprite(25,250,'bird',5);				
			}
		
		else{
			this.game.add.sprite(0,0,'background1');
			//this.bird=this.game.add.sprite(25,250,'bird1',5);
			}

		this.pipes = game.add.group();									//Load pipes
        this.pipes.createMultiple(30,'pipe');  
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this); 


        if(bgNum==0){									//Load the bird
			//this.game.add.sprite(0,0,'background');
			this.bird=this.game.add.sprite(25,250,'bird');				
			}
		
		else{
			//this.game.add.sprite(0,0,'background1');
			this.bird=this.game.add.sprite(25,250,'bird1');
			}



		this.game.add.sprite(10,10,'score_image');
		this.bird.body.gravity.y= 1000;   //Orginal 1000
		this.bird.anchor.setTo(0.2,0.5);
	
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space_key.onDown.add(this.jump,this);

		this.score = 0;
		var style = {font:'20px Arial',fill:'#000000'};
		this.label_score = this.game.add.text(38,35,"0",style);
	
		
	},

	update:function(){
		if(c==0){
			
			document.addEventListener("keydown",function(){ c++;
		
			
			},false);
		 }

		 	if(this.bird.inWorld==false)
			{	this.display_score(); }
			//this.restart_game(); }
			
		if(this.bird.angle<10)
			this.bird.angle+=1;
			
		if (game.input.activePointer.isDown)  {
			game.input.onTap.addOnce(this.jump,this);
			//this.touched = true;
			//this.jump();
			}
			

		this.game.physics.overlap(this.pipes,this.bird,this.hit_pipe,null,this);    //Collision Detection
			
	},
	
	add_one_pipe:function(x,y){
		var pipe = this.pipes.getFirstDead();
		pipe.reset(x,y);
		pipe.body.velocity.x = -150;
		pipe.outOfBoundsKill=true;
	},

	add_row_of_pipes:function(){
		var hole=Math.floor(Math.random()*5)+1;
		for(var i=0;i<=8;i++)
		{
			if (i != hole && i != hole +1 && i!=hole+2)
				this.add_one_pipe(400,i*60);
		}
		this.score+=1;
		this.label_score.content= this.score;
	},

	hit_pipe:function(){
		if(this.bird.alive=false)
			return ;
		
		
		var animation = this.game.add.tween(this.bird);			//Add animation
		animation.to({angle:+60},100);
		animation.start();

		this.game.time.events.remove(this.timer);
		  this.pipes.forEachAlive(function(p){
        	p.body.velocity.x = 0;
    		}, this);
		this.collide_sound.play();
		//Sounds.collide.play();
		
	},


	jump:function()
	{
		

		if(this.bird.alive==false)
			{
				return;}

		this.bird.body.velocity.y=-400;         //Orginal 450
		var animation = this.game.add.tween(this.bird);			//Add animation
		animation.to({angle:-20},100);
		animation.start();
		this.jump_sound.play();

	},

	display_score:function(){


		this.game.time.events.remove(this.timer);
		  this.pipes.forEachAlive(function(p){
        	p.body.velocity.x = 0;
    		}, this)
		 this.bird.alive=false;



		var text = " : "+this.score;
		var text_1 = " : "+ this.high_score();
		var style = { font: "25px Arial",fill:"#08088A",align:"center"};
		this.game.add.sprite(3,150,'gameOver_image');

		
		this.game.add.text(220,220,text,style);
		this.game.add.text(220,260,text_1,style);
		game.input.onTap.addOnce(this.restart_game,this);
	},
    high_score : function(){
      if(localStorage.getItem("namo")<this.score)
      localStorage.setItem("namo",this.score);

     return localStorage.getItem("namo") ;

    },

	

	
	restart_game:function(){
		this.game.time.events.remove(this.timer);
	    
		this.game.state.start('main');
	},


	
};


game.state.add('main',main_state);
game.state.start('main');
 