PennController.ResetPrefix(null); // Shorten command names (keep this line here))
PennController.DebugOff();

var shuffleSequence = seq("consent", "nameentry", "IDentry", 
                    "LexTale_instructions", "LexTale_trials", "closing",
                        "intro", "tech",
                        "startpractice",
                        sepWith("sep", seq("practice")),
 // putting counter after practice so it won't increment all at the same time when participants show up, as that messes up lists
                        "setcounter",
                        "starter",
 // trials named _dummy_ will be excluded by following:
            //            sepWith("sep", rshuffle(startsWith("break"), startsWith("hit"), startsWith("filler"))),
                        followEachWith("sep",randomize(anyOf(startsWith("rc"),startsWith("fill")))),
 // bilingual language profile survey
                        "blp.intro", 
                        "blp.bio",
                        "blp.history_intro",
                        "blp.history", 
                        "blp.use_intro",
                        "blp.use", 
                        "blp.profic_intro",
                        "blp.profic", 
                        "blp.attit_intro",
                        "blp.attit", 
 //                       "closing",
 						"sendresults",
                        "completion"
                );


newTrial("nameentry",
    newVar("partName").global()
    ,
    newText("instr2", "请用英文输入您的姓名：").print()
    ,
    newHtml("partpage2", "<input type='text' id='partName' name='participant name' min='1' max='120'>").print()
    ,
    newButton("clickcontinue", "点此继续").print().wait( 
        getVar("partName").set( v=>$("#partName").val() ).testNot.is('')
    )
)
.log("partName", getVar("partName"))
    
newTrial("IDentry",
    newVar("partID").global()
    ,
    newText("instr", "请输入您的电邮：").print()
    ,
    newHtml("partpage", "<input type='text' id='partID' name='participant email' min='1' max='120'>").print()
    ,
    newButton("clickcontinue", "点此继续").print().wait( 
        getVar("partID").set( v=>$("#partID").val() ).testNot.is('')
    )
)
.log("partID", getVar("partID"))
            
// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("partID").global()    
)
.log( "partid" , getVar("partID") ) // Add the ID to all trials' results lines

var showProgressBar =false;

var practiceItemTypes = ["practice"];

var manualSendResults = true;

var defaults = [
    "Maze", {redo: true, time:1000, emess: "答案错误", rmess: "请确认您选择最佳的词语延续句子"}, //uncomment to try "redo" mode
];

// following is from the A-maze site to make breaks every 15(ish) maze sentences
// you have to set the write number of total items and number of blocks to start with, and the right condition names, etc.
// calculate the following numbers to fill in the values below (not including practice trials-
// for Mandarin hit/break study:
// total maze sentences a participant will be presented: 96
// sentences per block: 24
// number of blocks: 4

function modifyRunningOrder(ro) {

    var new_ro = [];
    item_count=0;
    for (var i in ro) {
      var item = ro[i];
      // fill in the relevant stimuli condition names on the next line including fillers (all that should be counted for break purposes)
      if (item[0].type.startsWith("rc")|| item[0].type.startsWith("fill")) {
          item_count++;
          new_ro.push(item);
        // number after percent (remainder) after item_count is how many items between breaks. last number is total-items - 1
          if (item_count%24===0 & item_count<96){
         // value for item_count=== should be total_items - items_per_block (to trigger message that last block is coming up)
         // text says "only 1 set of sentences left"
              if (item_count===72){
                    ro[i].push(new DynamicElement("Message", 
                        { html: "<p>只剩下一组句子了！</p>", transfer: 3000 }));
                } else {
                // first number is the total number of blocks. second number is number of items per block
                // message says "end of block. n blocks left."
                    ro[i].push(new DynamicElement("Message", 
                        { html: "<p>本组句子结束，还剩"+(4-(Math.floor(item_count/24)))+" 组句子</p>", transfer: 3000 }));
                }
                // next message is added for all breaks after the count message
                ro[i].push(new DynamicElement("Message", 
                    { html: "<p>您有30秒时间休息， 如果您需要的话，可以短暂的看向屏幕以外的地方或者拉伸身体来放松，30秒后实验会自动开始。</p>", transfer: 30000 }));
          }
        } else {
    // if it's not an experimental trial, such as separator or other item, just show the item
             new_ro.push(item);
        }
    }
    return new_ro;
  }
  
// lextale instructions

PennController("LexTale_instructions",
  defaultText
  ,
  newText("LexTale_InstructionText", "您好，这是一个汉字测试。在下一页，您将会看到90个看上去像“汉字”的字，当中只有一些是真正存在的汉字。您需要对每一个字做出判断，如果您认为该字是在中文里存在的（即使您不能够明确地说出该字的意思）或者是您知道该字的话，请点击“是汉字”，如果您认为该字在中文里是不存在的，请点击“不是汉字”。您无需快速回答每一道问题，但请您根据您的第一反应来作答，不用过度的犹豫。请在没有任何外来帮忙的情况下独立完成此测试（不要使用任何汉语词典！）。所有的字皆为简体中文。") 
  ,
  newCanvas("myCanvas", 600, 600)
          .settings.add(0,0, getText("LexTale_InstructionText"))
          .print()
  ,              
  newTextInput("Subject", randomnumber = Math.floor(Math.random()*1000000))             
  ,
  newButton("Start")
      .print()
      .wait()
  ,
  newVar("Subject")
      .settings.global()
      .set( getTextInput("Subject") )
  )
  .log( "Subject" , getVar("Subject") )


/// Trials
PennController.Template(
    PennController.GetTable( "lextale.csv")
    ,
    trial => PennController("LexTale_trials",
        newImage("stimulus", trial.Stimulus)
            .size(50, 50)
            .center()
            .print()
        ,
//            newText("stimulus", trial.Stimulus)
//               .settings.css("font-size", "60px")
//                .settings.css("font-family", "avenir")
//                .settings.bold()
//                .settings.center()
//                .print()
//              ,
        newText("no", "不是汉字")
            .settings.css("font-size", "40px")
            .settings.css("font-family", "avenir")
            .settings.color("red")
            .settings.bold()
        ,
        newText("yes", "是汉字")
            .settings.css("font-size", "40px")
            .settings.css("font-family", "avenir")
            .settings.color("green")
            .settings.bold()

        ,
        newCanvas(800, 600)
            .settings.add( 0,     100,      getText("no"))
            .settings.add( 500,     100,    getText("yes"))
            .print()
        ,
        newSelector()
            .settings.add(getText("no") , getText("yes") )
            .settings.log()
            .wait()
    )
.log( "Stimulus"    , trial.Stimulus    )
.log( "Type"        , trial.Type        )
.log( "Block"       , trial.Block       )
.log( "Subject"         , getVar("Subject")         ) 
)

// Send results to server
//PennController.SendResults();

/// Closing text
PennController("closing",
    defaultText
        .print()
    ,
    newText("<p>Thank you for participating!</p>")
)





// experimental stimuli:
// template items will be pushed into native items = [] with fake PC trial _dummy_ output

Template("stimuli.csv", row => {
    items.push(
        [[row.label, row.item] , "PennController", newTrial(
            newController("Maze", {s: row.sentence, a: row.alternative, redo: true, time:1000, emess: "答案错误", rmess: "请确认您选择最佳的词语延续句子"})
              .print()
              .log()
              .wait()
        )
        .log("counter", __counter_value_from_server__)
        .log("label", row.label)
        .log("item", row.item)
        .log("list", row.group)
        ]
    );
    return newTrial('_dummy_',null);
})

var items = [

	["setcounter", "__SetCounter__", { }],

	["sendresults", "__SendResults__", { }],

	["sep", "MazeSeparator", {normalMessage: "正确! 请按任意键继续", errorMessage: "错误！请按任意键继续"}],

    ["consent", "Form", { html: { include: "consent.html" } } ],

    ["intro", "Form", { html: { include: "intro1.html" } } ],

    ["tech", "Form", { html: { include: "tech.html" } } ],

// ["begin", "PennController",
//         newTrial(
//             newVar("partID").global()
//             ,
//             newText("Please enter your Prolific ID:")
//             ,
//             newHtml("partpage", "<p>blah</p><input type='text' id='partID' name='participant ID' min='1' max='120'>").print()
//             ,
//             newButton("Next").print().wait( 
//                 getVar("partID").set( v=>$("#partID").val() ).testNot.is('')
//             )
//         )
//         .log("partID", getVar("partID"))
// ],

    ["startpractice", Message, {consentRequired: false,
        html: ["div",
            ["p", "您可以先做三组练习"]
            ]}],

//
//  practice items
//

    [["practice", 801], "Maze", {s:"老板的 手机 在会议中 响了", a:"x-x-x 咱们 氢氧化钠 狐狸"}],
    [["practice", 802], "Maze", {s:"爸爸 边看 电视 边讲 电话", a:"x-x-x 气孔 避免 腐朽 抓住"}],
    [["practice", 803], "Maze", {s:"运动员 在健身房 做了 重量 训练", a:"x-x-x 莎士比亚 螳螂 愤怒 爸爸"}],

   // message that the experiment is beginning

   ["starter", Message, {consentRequired: false,
	html: ["div",
		   ["p", "点此开始主实验"]
		  ]}],


// completion: 

    ["completion", "Form", {continueMessage: null, html: { include: "completion.html" } } ]

// leave this bracket - it closes the items section
];

// -------------------------------------------------------------------

//// BLP Section 
/// Instructions:

// Subject info
newTrial("blp.intro",
    newText("InstructionText", "我们想请您回答一些关于您语言使用的问题，以下的问题包含您的语言使用历史，使用状况，语言态度以及语言程度。此问卷是由德州大学奥斯丁分校的开放教育资源及语言学习中心所研发，目的在于帮助我们了解双语者在多元的环境跟背景之下的个人资料。此份问卷有19个问题，作答时间约为10分钟。此份问卷不是能力测验，所以并没有标准答案，请您根据您本身的状况据实回答即可，感谢您的回答。")
        .print()
    ,
    newButton("continue", "继续").print().wait()
)

// -------------------------------------------------------------------
// Biographical Information
  
newTrial("blp.bio",
    newHtml("bio_html", "demographics.html")
        .center()
        .log()
        .checkboxWarning("您同意后才能继续。")
        .radioWarning("您需要选择一个选项。")
        .inputWarning("这个部分需要填写。")
        .print()
    ,
    newButton("continue", "继续")
        .css("font-size","medium")
        .center()
        .print()
        .wait(    
            getHtml("bio_html").test.complete()
            .failure( getHtml("bio_html").warn())
            ,
            newTimer("waitDemo", 500)
                .start()
                .wait()
            )
)
// extra logs just to align columns
// apparently counter can only be used with templates
//.log("counter", __counter_value_from_server__)
.log("null0", "NULL")
.log("null1", "NULL")
.log("null2", "NULL")
.log("blp_item", "0")
.log( "category", "bio")
.log( "Subject", getVar("partID")) 


// -------------------------------------------------------------------
// Language History
newTrial("blp.history_intro",
    newText("history_text", "<b>语言使用历史:</b> 这个部份的问题，我们想请您回答一些关于您本身语言使用历史的问题，请在相符的框框中勾选您的答案。")
        .print()
    ,
    newButton("continue", "继续").print().wait()
)
Template(GetTable( "blp.csv")
        .filter( row => row.category == "history")  // filter where row.category value equals 'history'
    , row => 
    newTrial("blp.history",
            newText("quest_hist", row.question)
 //              .settings.css("font-size", "60px")
                .settings.css("font-family", "avenir")
                .print()
            ,
            newText("pad1", " ")  // adds padding between lines
                .css('font-size','2em')
                .print()
            ,
            newText("lang1", row.L1)  // adds padding between lines
                .css('font-size','1em')
                .print()
            ,
            newText("pad5", " ")  // adds padding between lines
                .css('font-size','1em')
                .print()
            ,
            defaultText
                .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
            ,
            newText("span1", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
                .color("blue")
                .print()
            ,
            defaultText
                .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
            ,   
            defaultScale
                .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
                .cssContainer("margin-bottom", "0.2em")
                .log()
            ,         
            newScale("lang1-scale",  ...row.scalevalues.split("."))
                .labelsPosition("top")
                .label(0, row.firstlabel)
                .label(row.lastnum, row.lastlabel)
                .keys()
                .print()
            ,
            newText("pad2", " ")  // adds padding between lines
                .css('font-size','2em')
                .print()
            ,
 // language 2
        newText("lang2", row.L2)  // adds padding between lines
            .css('font-size','1em')
            .print()
        ,
        newText("pad4", " ")  // adds padding between lines
           .css('font-size','1em')
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,   
        defaultScale
            .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
            .cssContainer("margin-bottom", "0.2em")
            .log()
        ,         
        defaultText
        .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,
// button labels
// "<span>left label</span><span>right label</span>"
        newText("span2", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
            .color("blue")
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,   
        newScale("lang2-scale",  ...row.scalevalues.split("."))
            .labelsPosition("top")
            .label(0, row.firstlabel)
            .label(row.lastnum, row.lastlabel)
            .keys()
            .print()
        ,
        getScale("lang1-scale")
        .wait("first")
        ,
        getScale("lang2-scale")
        .wait("first")
        ,    
        newText("pad3", " ")  // adds padding between lines
        .css('font-size','2em')
        .print()
        ,
        newButton("continue", "继续")
            .before(newCanvas("canv-continue",290,20))
            .print()
            .wait()
        )
    .log("counter", __counter_value_from_server__)
    .log( "quest_hist", row.question)
    .log("quest_null", "NULL")
    .log("blp_item", row.blp_item)
    .log( "category", row.category)
    .log( "Subject", getVar("partID")) 
    )


// -------------------------------------------------------------------
// Language Use
newTrial("blp.use_intro",
    newText("use_text", "<b>语言使用状况:</b> 在这个部分中，我们想请您回答一些关于您本身语言使用比例的问题，请在相符的框框中勾选您的答案。每一题的整体语言使用比例的总和必须为100%。")
        .print()
    ,
    newButton("continue", "继续").print().wait()
)

Template(GetTable( "blp.csv")
        .filter( row => row.category == "use")  // filter where row.category value equals 'history'
        , row => 
        newTrial("blp.use",
            newText("quest_use", row.question)
        //              .settings.css("font-size", "60px")
                .settings.css("font-family", "avenir")
                .print()
            ,
            newText("pad1", " ")  // adds padding between lines
                .css('font-size','2em')
                .print()
            ,
            newText("lang1", row.L1)  // adds padding between lines
                .css('font-size','1em')
                .print()
            ,
            newText("pad5", " ")  // adds padding between lines
                .css('font-size','1em')
                .print()
            ,
            defaultText
                .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
            ,
            newText("span1", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
                .color("blue")
                .print()
            ,
            defaultText
                .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
            ,   
            defaultScale
                .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
                .cssContainer("margin-bottom", "0.2em")
                .log()
            ,         
       newScale("lang1-scale",  ...row.scalevalues.split("."))
            .labelsPosition("top")
   //             .label(0, row.firstlabel)
   //             .label(row.lastnum, row.lastlabel)
                .keys()
                .print()
            ,
            newText("pad2", " ")  // adds padding between lines
                .css('font-size','2em')
                .print()
            ,
        // language 2
        newText("lang2", row.L2)  // adds padding between lines
            .css('font-size','1em')
            .print()
        ,
        newText("pad4", " ")  // adds padding between lines
            .css('font-size','1em')
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,   
        defaultScale
            .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
            .cssContainer("margin-bottom", "0.2em")
            .log()
        ,         
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,
        // button labels
        // "<span>left label</span><span>right label</span>"
        newText("span2", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
            .color("blue")
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,   
        newScale("lang2-scale",  ...row.scalevalues.split("."))
            .labelsPosition("top")
            .label(0, row.firstlabel)
            .label(row.lastnum, row.lastlabel)
            .keys()
            .print()
        ,
        newText("pad7", " ")  // adds padding between lines
        .css('font-size','2em')
        .print()
    ,
// other languages
        newText("langoth", "其他语言")  // adds padding between lines
            .css('font-size','1em')
            .print()
        ,
        newText("pad6", " ")  // adds padding between lines
            .css('font-size','1em')
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,   
        defaultScale
            .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
            .cssContainer("margin-bottom", "0.2em")
            .log()
        ,         
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,
        // button labels
        // "<span>left label</span><span>right label</span>"
        newText("span3", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
            .color("blue")
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,   
        newScale("langoth-scale",  ...row.scalevalues.split("."))
   //         .slider()
   //         .default(0)
            .labelsPosition("top")
            .label(0, row.firstlabel)
            .label(row.lastnum, row.lastlabel)
            .keys()
            .print()
        ,
        getScale("lang1-scale")
        .wait("first")
        ,
        getScale("lang2-scale")
        .wait("first")
        ,    
        getScale("langoth-scale")
        .wait("first")
        ,    
        newText("pad3", " ")  // adds padding between lines
        .css('font-size','2em')
        .print()
        ,
        newButton("continue", "继续")
            .before(newCanvas("canv-continue",290,20))
            .print()
            .wait()
        )
        .log("counter", __counter_value_from_server__)
        .log( "quest_use", row.question)
        .log("quest_null", "NULL")
        .log("blp_item", row.blp_item)
        .log( "category", row.category)
        .log( "Subject", getVar("partID")) 
        )


// -------------------------------------------------------------------
// Proficiency 
newTrial("blp.profic_intro",
    newText("profic_text", "<b>语言程度 </b> 在这个部分中，请您从1到7中自评您的语言程度。")
        .print()
    ,
    newButton("continue", "继续").print().wait()
)

Template(GetTable( "blp.csv")
    .filter( row => row.category == "proficiency")  // filter where row.category value equals 'proficiency'
    , row => 
    newTrial("blp.profic",
        newText("quest_prof", row.question)
//              .settings.css("font-size", "60px")
            .settings.css("font-family", "avenir")
            .print()
        ,
        newText("pad17", " ")  // adds padding between lines
            .css('font-size','1em')
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,
        newText("span1", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
            .color("blue")
            .print()
        ,
        defaultScale
            .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
            .cssContainer("margin-bottom", "0.2em")
            .log()
        ,         
        newScale("lang1-scale",  parseInt(row.scalevalues))
            .labelsPosition("top")
            .label(0, row.firstlabel)
            .label(row.lastnum, row.lastlabel)
            .keys()
            .print()
        ,
        newText("pad16", " ")  // adds padding between lines
            .css('font-size','2em')
            .print()
        ,
// language 2
        newText("quest_prof2", row.question_L2)
        //              .settings.css("font-size", "60px")
                .settings.css("font-family", "avenir")
                .print()
            ,
        newText("pad19", " ")  // adds padding between lines
        .css('font-size','1em')
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,   
        // button labels
        // "<span>left label</span><span>right label</span>"
        newText("span2", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
            .color("blue")
            .print()
        ,
        defaultScale
            .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
            .cssContainer("margin-bottom", "0.2em")
            .log()
        ,         
        newScale("lang2-scale",  parseInt(row.scalevalues))
            .labelsPosition("top")
            .label(0, row.firstlabel)
            .label(row.lastnum, row.lastlabel)
            .keys()
            .print()
        ,
        getScale("lang1-scale")
        .wait("first")
        ,
        getScale("lang2-scale")
        .wait("first")
        ,    
        newText("pad18", " ")  // adds padding between lines
        .css('font-size','2em')
        .print()
        ,
        newButton("continue", "继续")
            .before(newCanvas("canv-continue",290,20))
            .print()
            .wait()
        )
        .log("counter", __counter_value_from_server__)
        .log( "quest_prof", row.question)
        .log("quest_prof2", row.question_L2)
        .log("blp_item", row.blp_item)
        .log( "category", row.category)
        .log( "Subject", getVar("partID")) 
        )

        // -------------------------------------------------------------------
// Attitudes
newTrial("blp.attit_intro",
    newText("attit_text", "<b>语言态度 </b>在这个部分中， 阅读完关于语言态度的题目叙述之后，从1到7中，选出你对叙述的同意程度。")
        .print()
        ,
    newButton("continue", "继续").print().wait()
)

Template(GetTable( "blp.csv")
    .filter( row => row.category == "attitudes")  // filter where row.category value equals 'attitudes'
    , row => 
    newTrial("blp.attit",
        newText("quest_prof", row.question)
    //              .settings.css("font-size", "60px")
            .settings.css("font-family", "avenir")
            .print()
        ,
        newText("pad10", " ")  // adds padding between lines
            .css('font-size','1em')
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,
        newText("span1", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
            .color("blue")
            .print()
        ,
        defaultScale
            .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
            .cssContainer("margin-bottom", "0.2em")
            .log()
        ,         
        newScale("lang1-scale",  parseInt(row.scalevalues))
            .labelsPosition("top")
            .label(0, row.firstlabel)
            .label(row.lastnum, row.lastlabel)
            .keys()
            .print()
        ,
        newText("pad12", " ")  // adds padding between lines
            .css('font-size','2em')
            .print()
        ,
    // language 2
        newText("quest_prof2", row.question_L2)
        //              .settings.css("font-size", "60px")
                .settings.css("font-family", "avenir")
                .print()
            ,
        newText("pad13", " ")  // adds padding between lines
        .css('font-size','1em')
            .print()
        ,
        defaultText
            .css({display: 'flex', width: '700px', 'justify-content': 'space-between'})
        ,   
        // button labels
        // "<span>left label</span><span>right label</span>"
        newText("span2", '<span>'+row.leftlabel+'</span><span>'+row.rightlabel+'</span>')
            .color("blue")
            .print()
        ,
        defaultScale
            .css({width: "700px", 'max-width':'unset', 'margin-bottom':'0.5em'})
            .cssContainer("margin-bottom", "0.2em")
            .log()
        ,         
        newScale("lang2-scale",  parseInt(row.scalevalues))
            .labelsPosition("top")
            .label(0, row.firstlabel)
            .label(row.lastnum, row.lastlabel)
            .keys()
            .print()
        ,
        getScale("lang1-scale")
        .wait("first")
        ,
        getScale("lang2-scale")
        .wait("first")
        ,    
        newText("pad14", " ")  // adds padding between lines
        .css('font-size','2em')
        .print()
        ,
        newButton("continue", "继续")
            .before(newCanvas("canv-continue",290,20))
            .print()
            .wait()
    )
    .log("counter", __counter_value_from_server__)
    .log( "quest_prof", row.question)
    .log("quest_prof2", row.question_L2)
    .log("blp_item", row.blp_item)
    .log( "category", row.category)
    .log( "Subject", getVar("partID")) 
)

// prolific page URL: 
