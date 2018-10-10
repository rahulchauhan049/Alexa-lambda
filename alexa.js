
let speechOutput;
let reprompt;
let welcomeOutput = "Hi! this is personality teller. TO continue please tell me in which month you were born.";
let welcomeReprompt = `Try saying "i was born on september"`;
// 2. Skill Code =======================================================================================================
"use strict";
const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.e1b915d4-2133-4c74-a0d3-201b1c15b6e6";  // TODO replace with your app ID (OPTIONAL).
speechOutput = '';
const handlers = {
	'LaunchRequest': function () {
		this.emit(':ask', welcomeOutput, welcomeReprompt);
	},
	'AMAZON.HelpIntent': function () {
		speechOutput = 'Try saying "Tell me about people born on september"';
		reprompt = 'I can tell you personality about people based on month they were born.Try saying tell me personality of people born on august';
		this.emit(':ask', speechOutput, reprompt);
	},
   'AMAZON.CancelIntent': function () {
		speechOutput = 'Alright! I am now cancelling. Have a nice day buddy!';
		this.emit(':tell', speechOutput);
	},
   'AMAZON.StopIntent': function () {
		speechOutput = 'Alright Stopping the skill. Hope you come back soon.';
		this.emit(':tell', speechOutput);
   },
   'SessionEndedRequest': function () {
		speechOutput = 'Alright! Hope to see you soon. Bye!';
		//this.emit(':saveState', true);//uncomment to save attributes to db on session end
		this.emit(':tell', speechOutput);
   },
	'AMAZON.FallbackIntent': function () {
		speechOutput = 'sorry! is that a month name? Please specify a month name';
		this.emit(":ask", speechOutput, speechOutput);
    },
	'personality': function () {
		speechOutput = '';

		//any intent slot variables are listed here for convenience

		let monthSlotRaw = this.event.request.intent.slots.month.value;
		console.log(monthSlotRaw);
		let monthSlot = resolveCanonical(this.event.request.intent.slots.month);
		console.log(monthSlot);

		//Your custom intent handling goes here
		speechOutput = factTell(monthSlot);
		this.emit(":tell", speechOutput, speechOutput);
    },	
	'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted.  Do you want to try something else?";
        this.emit(':ask', speechOutput, speechOutput);
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
	//alexa.dynamoDBTableName = 'DYNAMODB_TABLE_NAME'; //uncomment this line to save attributes to DB
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function resolveCanonical(slot){
	//this function looks at the entity resolution part of request and returns the slot value if a synonyms is provided
	let canonical;
    try{
		canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
	}catch(err){
	    console.log(err.message);
	    canonical = slot.value;
	};
	return canonical;
};

function factTell(month){
    var randomText = [`If born on ${month}, you simply reject failure. You are passionate about your freedom. Your positive attitude, combined with your ambitions, results in enviable success. You are tenacious, passionate, quick-witted, resourceful, rebellious, ambitious, materialistic, and guarded.`,
    `People with a birthday on ${month} are straightforward and rebellious. The restless individual born on this month can also be reckless. But be careful! The consequences of such recklessness could change your life! Diligent, creative, energetic, ruthless, brash, destructive and tactless - is what people born on this month are like.`,
     `Those born on ${month} like being fit and thus maintain healthy lifestyles. Those born this month are likely to be understated artists whose creativity may be stifled. You are spontaneous, intellectual, exceptional, resilient, impatient, moody, pessimistic and irritable.`,
      `Your personality is tender and joyful. Typically, you avoid negativity. Despite your best efforts, you may end up being an idealistic and perhaps, commitment-phobic person. Sensitive, helpful, innocent, organized, humble, cagey, innovative, hasty, and lethargic, the personality of one born on ${month} is someone who is tender and joyful.`,
      `You are a mystical creature that uses your intuition for guidance. Your birthmonth helps you make a good love connection and even better business deals. You are communicative, rational, optimistic, unstable, detached, isolated, and impetuous.`,
      `Those born on ${month} have strong influences and possess secure ties with family. Your birthmonth suggests that dramatic changes in your life could damage your reputation. Hardworking, honest, inexpressive, sensitive, extravagant, full of self-doubt, distrustful, and unforgiving, describe those born on the ${month}`,
      `Those born on ${month} are impulsive, impatient and gifted. You are self-assured, sacrificing, faithful, steadfast, intolerant, complicated, shy and wasteful. You respect authority. You are a shy individual who wants a faithful partner.`,
      `Those born on ${month} are hardworking, but should not forget to have some fun. You are a workaholic who eats and sleeps business. You should relax and learn to delegate work. Truthful, industrious, discerning, idealistic, jealous, suspicious, selfish, aloof, and tensed is what you are like.`,
      `If your birthmonth is ${month}, you are remarkably humble. Accordingly, you balance your career and home, even though your capabilities are endless because you have the right alliances. You are a philosopher who is determined, humble, dedicated, negative, tensed, nervous and stressed.`,
      `Those born on ${month} have a charismatic personality. You are flirtatious and people are also drawn to your charitable ways. You have many underlying talents. You are amiable, motivated, interesting, mistrustful, deceptive, secretive and suspicious.`,
      `Those born on ${month} make awesome parents. You are likely to marry young, with a desire to live comfortably. You are fierce, intuitive, energetic, confident, unstable, hasty, controlling and irate.`,
      `The personality of someone born on ${month} is of a calm, imaginative and dependable person. You are funny, possess a magnetic attraction for money-making, are a go-getter, enthusiastic, shrewd, imaginative, laidback, secretive, difficult and dominating.`];
      
      var num = randomText.length;
      return randomText[Math.floor(Math.random()*num)];
}

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
	  let updatedIntent= null;
	  // updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      //this.emit(":delegate", updatedIntent); //uncomment this is using ASK SDK 1.0.9 or newer
	  
	  //this code is necessary if using ASK SDK versions prior to 1.0.9 
	  if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
			shouldEndSession: false
		});
		this.emit(':responseReady', updatedIntent);
		
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      //this.emit(":delegate"); //uncomment this is using ASK SDK 1.0.9 or newer
	  
	  //this code necessary is using ASK SDK versions prior to 1.0.9
		if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', null, null),
			shouldEndSession: false
		});
		this.emit(':responseReady');
		
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}


function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        let slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        let slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

//These functions are here to allow dialog directives to work with SDK versions prior to 1.0.9
//will be removed once Lambda templates are updated with the latest SDK

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    let alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    let returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}