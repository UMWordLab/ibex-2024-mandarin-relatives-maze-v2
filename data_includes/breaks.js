PennController.ResetPrefix(null); // Shorten command names (keep this line here))

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
      if (item[0].type.startsWith("stim")|| item[0].type.startsWith("fill")) {
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
  
