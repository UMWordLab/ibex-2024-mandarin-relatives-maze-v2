PennController.ResetPrefix(null); // Shorten command names (keep this line here))
//PennController.DebugOff();

var shuffleSequence = seq("consent", "nameentry", "IDentry", 
                    "LexTale_instructions", "LexTale_trials", 
 // putting counter after lextale so it won't increment all at the same time when participants show up, as that messes up lists
                    "setcounter",
                    "intro", "tech",
                    "startpractice",
                    sepWith("sep", seq("practice")),
                    "starter",
                    sepWith("sep", randomize(startsWith("warmup"))),
                    "sep",
 // trials named _dummy_ will be excluded by following:
                    sepWith("sep", rshuffle(startsWith("stimuli"), startsWith("fillers"))),	
                    "sep",
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
    )
    .log( "partid" , getVar("partID") ) // Add the ID to all trials' results lines
    .log( "partname" , getVar("partName") ) // Add the ID to all trials' results lines

var showProgressBar =false;

var practiceItemTypes = ["practice"];

var manualSendResults = true;

var defaults = [
    "Maze", {redo: true, time:1000, emess: "答案错误", rmess: "请确认您选择最佳的词语延续句子"}, //uncomment to try "redo" mode
];

// javascript function for custom trials 
mazeTrial = label => row => newTrial(label + "_" + row.type + "_" + row.item + "_" +row.condition,
        newController("Maze", {s: row.sentence, a: row.alternative, redo: true, time:1000, emess: "答案错误", rmess: "请确认您选择最佳的词语延续句子"})
        .print()
        .log()
        .wait()
        )
        .log("counter", __counter_value_from_server__)
        .log("type", row.type)
        .log("subtype", row.subtype)
        .log("stimitem", row.item)
        .log("condition", row.condition)
        .log("list", row.group)


// warmup
Template("warmup.csv", mazeTrial("warmup"))

// experimental stimuli and listed fillers
Template("stimuli.csv", mazeTrial("stimuli"))

// fillers without groups
Template("fillers.csv", mazeTrial("fillers"))

var items = [

	["setcounter", "__SetCounter__", { }],

	["sendresults", "__SendResults__", { }],

	["sep", "MazeSeparator", {normalMessage: "正确! 请按任意键继续", errorMessage: "错误！请按任意键继续"}],

    ["consent", "Form", { html: { include: "consent.html" } } ],

    ["intro", "Form", { html: { include: "intro1.html" } } ],

    ["tech", "Form", { html: { include: "tech.html" } } ],

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

// prolific page URL: 
