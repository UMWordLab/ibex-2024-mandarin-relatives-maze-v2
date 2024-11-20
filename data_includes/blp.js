PennController.ResetPrefix(null); // Shorten command names (keep this line here))

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
//.log( "Subject", getVar("partID")) 


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
 //   .log( "Subject", getVar("partID")) 
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
      //  .log( "Subject", getVar("partID")) 
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
     //   .log( "Subject", getVar("partID")) 
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
 //   .log( "Subject", getVar("partID")) 
)

