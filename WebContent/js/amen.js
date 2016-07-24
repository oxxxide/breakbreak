//Copyright © 2016 OXXXIDE All Rights Reserved.

var context;
var smplr;
var eff;
var gain = 1;
var player;
var scriptNode
var blockSize = 1024;

var prob = function(posibiity) {
	return (posibiity >= Math.random());
}

function start() {

	var counter = 0;

	eff = new Effect();
	refresh();

	var beat = []
	var delta = smplr.length / 16.0;
	for (var i = 0; i < 16; i++) {
		beat[i] = Math.floor(delta * i);
	}

	scriptNode = context.createScriptProcessor(blockSize, 2, 2);
	scriptNode.onaudioprocess = function(e) {
		var outL = e.outputBuffer.getChannelData(0);
		var outR = e.outputBuffer.getChannelData(1);
		for (var i = 0; i < blockSize; i++) {

			if (smplr.length < counter) {
				counter = 0;
			}
			
			
			

			switch (Math.floor(counter)) {
				case beat[0] :
					//console.log(1);
					eff.take(smplr, 0);
					break;
				case beat[1] :
					//console.log(2);
					eff.take(smplr, 1);
					break;
				case beat[2] :
					//console.log(3);
					eff.take(smplr, 2);
					break;
				case beat[3] :
					//console.log(4);
					eff.take(smplr, 3);
					break;
				case beat[4] :
					//console.log(5);
					eff.take(smplr, 4);
					break;
				case beat[5] :
					//console.log(6);
					eff.take(smplr, 5);
					break;
				case beat[6] :
					//console.log(7);
					eff.take(smplr, 6);
					break;
				case beat[7] :
					//console.log(8);
					eff.take(smplr, 7);
					break;
				case beat[8] :
					//console.log(9);
					eff.take(smplr, 8);
					break;
				case beat[9] :
					//console.log(10);
					eff.take(smplr, 9);
					break;
				case beat[10] :
					//console.log(11);
					eff.take(smplr, 10);
					break;
				case beat[11] :
					//console.log(12);
					eff.take(smplr, 11);
					break;
				case beat[12] :
					//console.log(13);
					eff.take(smplr, 12);
					break;
				case beat[13] :
					//console.log(14);
					eff.take * (smplr, 13);
					break;
				case beat[14] :
					//console.log(15);
					eff.take(smplr, 14);
					break;
				case beat[15] :
					//console.log(16);
					eff.take(smplr, 15);
					break;
			}

			var val = smplr.progress();
			outL[i] = val[0] * gain;
			outR[i] = val[1] * gain;
			counter+=smplr.speed;

		}
	}

	scriptNode.connect(context.destination);

	player = context.createOscillator();
	player.connect(scriptNode);
	player.start(0);

}

var Effect = function() {
	
	this.reverse = 0.1;
	this.roll = 0.3;
	this.pitch = 0;
	this.warp = 0.2;	
	this.impulse = 0.05;
	
	this.setParams = function(warp, roll, reverse, impulse) {
		this.warp = warp;
		this.roll = roll;
		this.reverse = reverse;
		this.impulse = impulse;
	}
	
	this.setWarp = function(value){
		console.log('warp:'+value);
		this.warp = (value*0.01);
	};
	
	this.setReverse = function(value){
		console.log('rev:'+value);
		this.reverse = (value*0.01);
	};
	
	this.setRoll = function(value){
		console.log('roll:'+value);
		this.roll = (value*0.01);
	};
	
	this.setImpulse = function(value) {
		console.log('impulse:'+value);
		this.impulse = (value*0.01);
	}

	this.take = function(sampler, position) {
		sampler.impulseFlg = false;
		if (prob(this.warp)) {
			sampler.setPosition(Math.floor(Math.random() * 16));
		} else {
			sampler.setPosition(position);
		}		
		if(prob(this.reverse)){
			sampler.reverse();
			return;
		}
		if(prob(this.impulse)){			
			sampler.impulse();
			return;
		}		
		if (prob(this.roll)) {
			var range
			if (prob(0.5)) {
				range = 2;
			} else if (prob(0.5)) {
				range = 4;
			} else if (prob(0.7)) {
				range = 8;
			} else {
				reange = 16;
			}
			smplr.setLoop(range);
			smplr.loop = true;
		} else {
			smplr.loop = false;
		}		
	};
}

var Sampler = function(audioBuffer) {

	this.speed = 1.0;
	this.cursor = 0.0;
	this.revCount = 0;
	this.audioBuffer = audioBuffer;
	this.pcm = [];
	this.loop = false;
	this.loopStart = undefined;
	this.loopEnd = undefined;
	this.impulseFlg = false;
	this.impulseLength = 10;
	
	for (var i = 0; i < audioBuffer.numberOfChannels; i++) {
		this.pcm[i] = audioBuffer.getChannelData(i)
	}

	var dataLength = this.pcm[0].length;
	this.length = dataLength;
	var oneBeat = Math.floor(this.length / 16.0);
	this.impulseLength = Math.floor(oneBeat/8.0);
	this.impulseMaxLength = this.impulseLength;
	var ret = [];
	this.progress = function() {
		var index = Math.floor(this.cursor);
		ret[0] = this.pcm[0][index];
		ret[1] = this.pcm[1][index];

		

		if (this.impulseFlg) {
			if (this.impulseLength <= 0) {
				ret[0] = 0;
				ret[1] = 0;
				return ret;
			} else {
				this.impulseLength--;
			}
		}
		
		if (this.revCount > 0) {
			this.cursor -= this.speed;
			this.revCount -= this.speed;
		} else {			
			this.cursor += this.speed;
		}
		
		if (this.loop) {
			if (this.loopEnd < this.cursor) {
				this.cursor = this.loopStart;
			}
		} else {
			if (dataLength < this.cursor) {
				this.cursor -= dataLength;
			}else if(this.cursor<0){
				this.cursor = dataLength - this.cursor
			}
		}

		return ret;
	}

	this.setPosition = function(beat) {
		var point = Math.floor(beat * oneBeat);
		this.cursor = point;
	}
	this.setLoop = function(range) {
		this.loopStart = this.cursor;
		this.loopEnd = this.loopStart + (Math.floor(oneBeat / range));
	}
	this.reverse = function() {
		this.revCount = oneBeat;
	}
	this.impulse=function(){
		this.impulseLength = this.impulseMaxLength;
		this.impulseFlg = true;
	}
	
	this.warp = function(point) {
		if (point < 0) {
			point = 0;
		}
		if (point > dataLength) {
			point = dataLength;
		}
		this.cursor = point;
	}
}



var init = function() {
	try {
		AudioContext = window.AudioContext;
		context = new AudioContext();
		loadSample('./resources/sound/cw_amen01_175.wav');
	} catch (e) {
		alert('Web Audio API is not supported in this browser');
	}
}

window.addEventListener('load', init, false);

var loadSample = function(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
					console.log('loaded!')
					smplr = new Sampler(buffer);
					displayBPM(buffer);
					start();
				});
	}
	request.send();
}



function setGain(value) {
	gain = (value * 0.01);
}

function changeBPM(value) {
	if (smplr) {
		smplr.speed = (value * 0.01);
		displayBPM(smplr.audioBuffer)
	}
}

function displayBPM(audioBuffer){
	var  length = audioBuffer.getChannelData(0).length;
	var srate = audioBuffer.sampleRate ;
	var bpm = Math.round(60/(length/srate/8)*smplr.speed);
		console.log(length+","+srate+","+bpm);
	document.getElementById("bpm").innerText = bpm
}

function selectSample(node){
	console.log(node.value);
	player.disconnect(0);
	scriptNode.disconnect(0);
	loadSample('./resources/sound/'+node.value+'.wav');
}

function refresh(){
	var gV = function(id){
		return (document.getElementById(id).value * 0.01);
	}	
	eff.setParams(gV('randomize'),gV('roll'),gV('reverse'),gV('mute'));
}