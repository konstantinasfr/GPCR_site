////// BEZIER THINGS ///////
bezier_cache = [];
function wherebezier(p04,p14,p24,step,stop,p34,allow_cache) {
    //https://en.wikipedia.org/wiki/B%C3%A9zier_curve
    pos = 0;
    length = 0;
    var p = p04;
    xy = [0,0];

    i = 0;
    while (pos <= 1) {
        if (length>stop) { //stop if it reached the length along the line
            break;
        }
        if (i in bezier_cache && allow_cache) {
            xy = bezier_cache[i][0];
            length = bezier_cache[i][1];
        } else {

            if (p34 === undefined) {
                xy = bezier(p04,p14,p24,pos);
            } else {
                xy = bezier_high(p04,p14,p24,p34,pos);
            }
            length += Math.round(100*Math.sqrt( Math.pow(xy[0]-p[0],2) + Math.pow(xy[1]-p[1],2) ))/100;
        }
        p = xy;
        pos += step;
        bezier_cache[i] =  [xy,length]
        i += 1;
    }
    return [xy,length];
}

function lengthbezier(p03,p13,p23,step,p33) {
    //https://en.wikipedia.org/wiki/B%C3%A9zier_curve

    pos = 0;
    length = 0;
    p = p03;
    while (pos <= 1) {

        if (p33 === undefined) {
            xy = bezier(p03,p13,p23,pos);
        } else {
            xy = bezier_high(p03,p13,p23,p33,pos);
        }

        length += Math.sqrt( Math.pow(xy[0]-p[0],2) + Math.pow(xy[1]-p[1],2) );
        p = xy;
        pos += step;
    }
    return Math.round(length);
}

function bezier(p02,p12,p22,t){
    //https://en.wikipedia.org/wiki/B%C3%A9zier_curve
    v1x = p12[0]-p02[0];
    v1y = p12[1]-p02[1];

    i12 = [p02[0]+(p12[0]-p02[0])*t,p02[1]+(p12[1]-p02[1])*t];
    i22 = [p12[0]+(p22[0]-p12[0])*t,p12[1]+(p22[1]-p12[1])*t];

    return [i12[0]+(i22[0]-i12[0])*t,i12[1]+(i22[1]-i12[1])*t];
}

function bezier_high(p01,p11,p21,p31,t){
    //https://en.wikipedia.org/wiki/B%C3%A9zier_curve
    i1 = bezier(p01,p11,p21,t);
    i2 = bezier(p11,p21,p31,t);

    return [i1[0]+(i2[0]-i1[0])*t,i1[1]+(i2[1]-i1[1])*t];
}

function add_box(x,y,name,color){
    box_text = "";
    name = name.substring(0, 6);
    n = name.length;
    width = n*7+2;
    box_text += "<rect class='"+name+" construct_custom' x="+(x-width/2)+" y="+(y-10)+" rx=5 ry=5 width='"+width+"' height='20' stroke='"+color+"' fill='white' stroke-width='2' style2='fill:red;stroke:black;stroke-width:5;opacity:0.5'/>";
    box_text += "<text  class='"+name+" construct_custom rtext' x="+(x)+" y="+(y+4)+" text-anchor='middle' font-size=12 font-family='helvetica'>"+name+"</text>";
    return box_text;
}
//////////////////////////



presetColors = {'D': ['#E60A0A', '#FDFF7B'],'E': ['#E60A0A', '#FDFF7B'],
                'K': ['#145AFF', '#FDFF7B'],'R': ['#145AFF', '#FDFF7B'],
                'S': ['#A70CC6', '#FDFF7B'],'T': ['#A70CC6', '#FDFF7B'],
                'N': ['#A70CC6', '#FDFF7B'],'Q': ['#A70CC6', '#FDFF7B'],
                'V': ['#E6E600', '#000000'],'L': ['#E6E600', '#000000'],
                'I': ['#E6E600', '#000000'],'A': ['#E6E600', '#000000'],
                'M': ['#E6E600', '#000000'],'F': ['#18FF0B', '#000000'],
                'Y': ['#18FF0B', '#000000'],'W': ['#0BCF00', '#000000'],
                'H': ['#0093DD', '#000000'],'P': ['#CC0099', '#FDFF7B'],
                'C': ['#B2B548', '#000000'],'G': ['#FF00F2', '#000000'],
                '-': ['#FFFFFF', '#000000'],
                '+': ['#FFFFFF', '#000000']
                };

var translateOffset = 0;
function showToolTip(x, y, str,rid,plotid) {
    var tipElement = document.getElementById('tool-tip-'+plotid);

    var originalCircle = $('#'+plotid).find("#"+rid);

    //console.log(originalCircle.attr('extra'));
    //originalCircle.attr('extra');

    var rect = tipElement.childNodes[1];
    var text = tipElement.childNodes[3];

    while (text.lastChild) {
       text.removeChild(text.lastChild);
    }

    // var NS = "http://www.w3.org/2000/svg";


    // //text.textContent =  str;
    //     var text_tspan = document.createElementNS(NS, "tspan");


    //     rect.setAttribute('height', 25);
    //     rect.setAttribute('y', -40);
    //     text_tspan.textContent = String(str);
    //     text.appendChild(text_tspan);

    if (originalCircle.attr('extra')) { //Only display if mutateddata flag is on and there is info

        text.innerHTML =  "<tspan  x=\"0\" y=\"-33\">" + str + "</tspan>";
        //text.innerHTML =  text.innerHTML + "<tspan  x=\"0\" y=\"-20\">" + residueColor.mutatedCalc[rid][0] + " mutations" + " | " + residueColor.mutatedCalc[rid][1] + " maxFold"+ " | " + residueColor.mutatedCalc[rid][2] + " minFold </tspan>";
        text.innerHTML =  text.innerHTML + "<tspan  x=\"0\" y=\"-20\">" + originalCircle.attr('extra') + " </tspan>";
        rect.setAttribute('height', 35);
        rect.setAttribute('y', -50);
    } else {
        text.innerHTML =  "<tspan  x=\"0\" y=\"-23\">" + str + "</tspan>";
        rect.setAttribute('height', 25);
        rect.setAttribute('y', -40);
    }

    var bbox = text.getBBox();
    rect.setAttribute('width', bbox.width + 8);
    rect.setAttribute('x', -bbox.width/2 - 4);

    var transX = (x <= (bbox.width + 8) / 2) ? (bbox.width + 8) / 2 : x;
    tipElement.setAttribute('transform', 'translate(' + transX + ',' + (y + translateOffset) + ')');
    tipElement.setAttribute('visibility', 'visible');
}

function hideToolTip(plotid) {
    var tipElement = document.getElementById('tool-tip-'+plotid);
    tipElement.setAttribute('visibility', 'hidden');
}

function toggleLoop(id, type, skipmaxmin, el) {
  svg = $(el).closest('svg');
    if (type=='long') {
      svg.find(id+".long").hide();
      svg.find(id+".short").show();
    } else {
      svg.find(id+".long").show();
      svg.find(id+".short").hide();
    }
    // $(id+".long").each(function () {
    //     curr = $(this).css("display");
    //     if (curr == 'none') $(this).removeAttr("display");
    //     if (!curr) $(this).css("display", "none");
    // });

    // $(id+".short").each(function () {
    //     curr = $(this).css("display");
    //     if (curr == 'none') $(this).removeAttr("display");
    //     if (!curr) $(this).css("display", "none");
    // });
    // console.log('draw c', (+new Date()) - start);
/*    if (id == ".ICL3" || id == ".ICL2" || id == ".ICL1" || id == ".C-term" ) {
      if (skipmaxmin!=1) redraw_terminus("C");
    }
    // console.log('draw n', (+new Date()) - start);
    if (id == ".ECL3" || id == ".ECL2" || id == ".ECL1" || id == ".N-term" ) {
      if (skipmaxmin!=1) redraw_terminus("N");
    }*/
    // console.log('maxmin', (+new Date()) - start);
    // if (skipmaxmin!=1) maxmin();
    // console.log('done', (+new Date()) - start);
    // if (skipmaxmin!=1) $("#snake").html($("#snake").html());
    // if (skipmaxmin!=1) reload_tooltips();

    // console.log('toggleLoop');
    if (skipmaxmin!=1 && typeof overlay_modifications === 'function') overlay_modifications();
    if (skipmaxmin!=1) maxmin();
}

function redraw_terminus(term) {
  // console.log('redraw term',term);
  if (term=='C') {
    orientation = 1;
    y_max = 0;
    // y_min = 0;
    var x_max = 0;
    $( "circle.ICL1:visible,circle.ICL2:visible,circle.ICL3:visible" ).each(function() {
      this_y = parseInt($(this).attr('cy'));
      if (this_y>y_max) y_max = this_y;
    });
    $( "rect.ICL1:visible,rect.ICL2:visible,rect.ICL3:visible" ).each(function() {
      this_y = parseInt($(this).attr('y'));
      if (this_y>y_max) y_max = this_y;
    });
    y_max = y_max+50;
  } else {
    // N -term
    orientation = -1;
    y_min = 0;
    // $( "circle.ECL1:visible,circle.ECL2:visible,circle.ECL3:visible" ).each(function() {
    //   this_y = parseInt($(this).attr('cy'));
    //   if (this_y<y_min) y_min = this_y;
    // });
    $( "rect.ECL1:visible,rect.ECL2:visible,rect.ECL3:visible" ).each(function() {
      this_y = parseInt($(this).attr('y'));
      if (this_y<y_min) y_min = this_y;
    });
    y_min = y_min-50;
    var x_max = x_svgmax; //from minmax function
  }
    // console.log('maxmin found');

  // var x1 =
  var residues = [];
  // generate list of positions to move
  $( "circle."+term+"-term:visible" ).each(function() {
      id = $(this).attr('id');
      residues.push(parseInt(id));
      // this_y = $(this).attr('y');
      // console.log('touching pos id',id);
  });
  var pos = 40;
  var length = 0;
  var between_residues = 18;
  var pos_bend = 0;
  var bend = 0;
  var distance_between_rows = 30;
  var bend_direction = -1*orientation;
  if (term=='N') {
    residues.reverse();
  }
  // console.log('residues',residues);
  bezier_cache = [];
  animation_delay = (1000/residues.length);
  // console.log("redraw half");
  $.each(residues, function(key,val) {
    if (key==0) {
      // grab the first anchor point
      if (term=='N') {
        x1 = parseInt($('#snake>#'+(val+1)).attr('cx'));
        y1 = parseInt($('#snake>#'+(val+1)).attr('cy'));
      } else {
        x1 = parseInt($('#snake>#'+(val-1)).attr('cx'));
        y1 = parseInt($('#snake>#'+(val-1)).attr('cy'));
      }
      x2 = x1-90*orientation;
      if (term=='N') {
        y2 = y_min
        bezierY = (y_min+y1)/2+60*orientation;
      } else {
        y2 = y_max;
        bezierY = (y_max+y1)/2+60*orientation;
      }
      bezierX = x1+60*orientation;


      // console.log('move residue ',val,'attach to id',key,pos,length,y_max,"Helix anchor",$('#'+(val+1)),(val+1),x1,y1);

      if (term=='C' && y2<bezierY) y2=bezierY;

      points = "M "+(x1)+" "+(y1)+" Q"+(bezierX)+" "+(bezierY)+" "+(x2)+" "+(y2);
      length = lengthbezier([x1,y1],[bezierX,bezierY],[x2,y2],0.001);

      // console.log("new path",points,"length",length);
      // $("path."+term+"-term.long").remove();
      // $("line."+term+"-term.long").remove();
      // path = "<path class='"+term+"-term long' d='" + points + "' stroke='black' fill='none' stroke-width='4' />";
      // $("#snake").append(path);
      $("rect."+term+"-term.long").attr('y',(y1+y2)/2);
      $("rect."+term+"-term.long").next().attr('y',13+(y1+y2)/2);

    }
    if (pos<length) {
      // on first bend
      [where,cur_length] = wherebezier([x1,y1],[bezierX,bezierY],[x2,y2],0.001,pos);
      // console.log(id,key,where,cur_length);

      if (key==0){
        $("line."+term+"-term.long").attr('x1',x1);
        $("line."+term+"-term.long").attr('y1',y1);
        $("line."+term+"-term.long").attr('x2',where[0]);
        $("line."+term+"-term.long").attr('y2',where[1]);
        // line = "<line class='"+term+"-term long' x1="+x1+" y1="+y1+" x2="+where[0]+" y2="+where[1]+" stroke='black' fill='none' stroke-width='2' />"
        // $("#snake").prepend(line);
      }

    } else {
        if (where[1]<y2 && term=='C') where[1]=y2;
        if (where[1]>y2 && term=='N') where[1]=y2;
        if (pos_bend==0 && bend!=0){
          where[0] = where[0]-between_residues*bend_direction;
          where[1] = where[1]+orientation*distance_between_rows/2;
        } else if (pos_bend==between_residues && bend!=0) {
          //#if 2nd residue in line put in middle
           where[0] = where[0]+between_residues*bend_direction;
           where[1] = where[1]+orientation*distance_between_rows/2;
         } else {
          where[0] = where[0]+between_residues*bend_direction;
          where[1] =  where[1];
        }
        last_bend_x = where[0];
        last_bend_y = where[1];
        pos_bend += between_residues;


        if (pos_bend>=Math.abs(x2-x_max)-40) {
          //no more bend left
            pos_bend = 0;
            bend += 1;
            if (bend_direction==1){
                bend_direction = -1;
            } else if (bend_direction==-1){
                bend_direction = 1;
            }
          }
    }
      // move residue
      if (where[0]!=$("#"+val).attr('cx') && where[1]!=$("#"+val).attr('cy')) {
        $("#"+val).attr('cx',where[0]);
        $("#"+val).attr('cy',where[1]);
        $("#"+val+"t").attr('x',where[0]);
        $("#"+val+"t").attr('y',where[1]+6);

        // delay = Math.round(key*animation_delay/10)*10;

        // $("#"+val).hide().delay( delay ).show(1);
        // $("#"+val+"t").hide().delay( delay ).show(1);

        if (where[1]<y_min && term=="N") y_min = where[1];
        if (where[1]>y_max && term=="C") y_max = where[1];
        // console.log('delay!',key*100,animation_delay,key*animation_delay,delay);
      }
      // $("#"+val).delay( key*100 ).queue(function() {$(this).attr('cx',where[0]).dequeue(); });
      // $("#"+val).delay( key*100 ).queue(function() { $(this).attr('y',where[1]).dequeue(); });
      // $("#"+val+"t").delay( key*100 ).queue(function() { $(this).attr('x',where[0]).dequeue(); });
      // $("#"+val+"t").delay( key*100 ).queue(function() { $(this).attr('y',where[1]+6).dequeue(); });

    pos += between_residues;

  });
  // console.log("redraw done");
      // move label box
  // console.log(term,"min",y_min,"max",y_max);

}

function applyPresentColors(target) {

    // Color all residues by their amino acid using the presetColors array

    $('#'+target).find(".rcircle").each(function( index ){
          aa =  $(this).next().text().trim();
          $(this).css("fill", presetColors[aa][0]);
          $(this).next().css("fill", presetColors[aa][1]);
        });

};




function resetColors(target) {

    // Reset color of all residues

    $('#'+target).find(".rcircle").each(function( index ){
          aa =  $(this).next().text();
          $(this).css("fill", 'white');
          $(this).next().css("fill", 'black');
        });
}


function toggleHighlightForItems(selector) {
  var listItems = document.querySelectorAll(selector);
  listItems.forEach(function (item) {
      // Check if the item is currently highlighted
      if (item.classList.contains('highlighted')) {
          toggleHighlight(item);
      }
  });
}

function resetColorsAndUnhighlight(target) {
  // Reset color of all residues
  $('#' + target).find(".rcircle").each(function (index) {
      aa = $(this).next().text();
      $(this).css("fill", 'white');
      $(this).next().css("fill", 'black');
  });

// var listItems = document.querySelectorAll('#myDropdown_mrmr_com_10 a');
// listItems.forEach(function (item) {    
//     // Check if the item is currently highlighted
//     if (item.classList.contains('highlighted')) {
//       toggleHighlight(item);
//     }
// });
toggleHighlightForItems('#myDropdown_mrmr_residues_10 a');
toggleHighlightForItems('#myDropdown_sfm_lgb_residues_10 a');
toggleHighlightForItems('#myDropdown_mrmr_com_10 a'); // Call for the first set of items
toggleHighlightForItems('#myDropdown_mrmr_com_1 a'); // Call for the first set of items
toggleHighlightForItems('#myDropdown_mrmr_ca_10 a'); // Call for the first set of items
toggleHighlightForItems('#myDropdown_mrmr_ca_1 a'); // Call for the first set of items
toggleHighlightForItems('#myDropdown_mrmr_min_10 a'); // Call for the first set of items
toggleHighlightForItems('#myDropdown_mrmr_min_1 a'); // Call for the first set of items
toggleHighlightForItems('#myDropdown_mrmr_com_4 a'); // Call for the first set of items
}

function handleDropdownItemClickPairs(item) {
  var action = item.getAttribute('data-action');
  var value1 = item.getAttribute('residue1');
  var value2 = item.getAttribute('residue2');
  var color = item.getAttribute('color');

  if (!item.classList.contains('highlighted')) {
      ColorPairFunction(value1, value2, color);
      toggleHighlight(item);
  } else {
      toggleHighlight(item);
      UncolorPairFunction(value1, value2, color);
  }
}

// Custom function that accepts a value
function UncolorPairFunction(value1,value2,color) {
  // Use the passed value in your function
  $('#'+'snakeplot').find("#"+value1).css("fill", '#FFFFFF');
  $('#'+'snakeplot').find("#"+value2).css("fill", '#FFFFFF');
//   console.log('doSomething was called with value:', value);
  // Perform your custom action here
}

// Alternate function to be called when item is not highlighted
function ColorPairFunction(value1,value2,color) {
  // Use the passed value in your alternate function
  $('#'+'snakeplot').find("#"+value1).css("fill", color);
  $('#'+'snakeplot').find("#"+value2).css("fill", color);
  // Perform your alternate action here
}


function residues_interaction(plotid, typeFS) {

  resetColorsAndUnhighlight(plotid);

  if (typeFS == "mrmr" ) {
    var res_dict = {"136": {"freq": 40, "color": "#08306b"}, "332": {"freq": 39, "color": "#083572"}, "147": {"freq": 27, "color": "#2575b7"}, "333": {"freq": 26, "color": "#2a7ab9"}, "377": {"freq": 23, "color": "#3b8bc2"}, "115": {"freq": 19, "color": "#549ecd"}, "334": {"freq": 15, "color": "#70b1d7"}, "354": {"freq": 14, "color": "#78b5d8"}, "250": {"freq": 13, "color": "#80b9da"}, "336": {"freq": 13, "color": "#80b9da"}, "166": {"freq": 13, "color": "#80b9da"}, "178": {"freq": 12, "color": "#8abfdc"}, "199": {"freq": 11, "color": "#92c3de"}, "356": {"freq": 9, "color": "#a1cbe2"}, "383": {"freq": 9, "color": "#a1cbe2"}, "93": {"freq": 9, "color": "#a1cbe2"}, "138": {"freq": 8, "color": "#a8cee4"}, "275": {"freq": 7, "color": "#afd1e6"}, "234": {"freq": 6, "color": "#b5d3e9"}, "382": {"freq": 6, "color": "#b5d3e9"}, "127": {"freq": 6, "color": "#b5d3e9"}, "142": {"freq": 6, "color": "#b5d3e9"}, "202": {"freq": 4, "color": "#c3d9ee"}, "326": {"freq": 4, "color": "#c3d9ee"}, "169": {"freq": 4, "color": "#c3d9ee"}, "179": {"freq": 3, "color": "#c8dcef"}, "206": {"freq": 3, "color": "#c8dcef"}, "210": {"freq": 3, "color": "#c8dcef"}, "219": {"freq": 2, "color": "#cbdef0"}, "123": {"freq": 2, "color": "#cbdef0"}, "233": {"freq": 2, "color": "#cbdef0"}, "193": {"freq": 2, "color": "#cbdef0"}, "188": {"freq": 2, "color": "#cbdef0"}, "399": {"freq": 2, "color": "#cbdef0"}, "102": {"freq": 2, "color": "#cbdef0"}, "72": {"freq": 2, "color": "#cbdef0"}, "146": {"freq": 2, "color": "#cbdef0"}, "143": {"freq": 2, "color": "#cbdef0"}, "357": {"freq": 2, "color": "#cbdef0"}, "387": {"freq": 2, "color": "#cbdef0"}, "74": {"freq": 1, "color": "#cfe1f2"}, "393": {"freq": 1, "color": "#cfe1f2"}, "189": {"freq": 1, "color": "#cfe1f2"}, "144": {"freq": 1, "color": "#cfe1f2"}, "360": {"freq": 1, "color": "#cfe1f2"}, "190": {"freq": 1, "color": "#cfe1f2"}, "343": {"freq": 1, "color": "#cfe1f2"}, "351": {"freq": 1, "color": "#cfe1f2"}, "359": {"freq": 1, "color": "#cfe1f2"}, "70": {"freq": 1, "color": "#cfe1f2"}, "319": {"freq": 1, "color": "#cfe1f2"}, "152": {"freq": 1, "color": "#cfe1f2"}, "322": {"freq": 1, "color": "#cfe1f2"}, "156": {"freq": 1, "color": "#cfe1f2"}, "134": {"freq": 1, "color": "#cfe1f2"}, "391": {"freq": 1, "color": "#cfe1f2"}, "327": {"freq": 1, "color": "#cfe1f2"}, "218": {"freq": 1, "color": "#cfe1f2"}, "231": {"freq": 1, "color": "#cfe1f2"}, "315": {"freq": 1, "color": "#cfe1f2"}, "325": {"freq": 1, "color": "#cfe1f2"}, "92": {"freq": 1, "color": "#cfe1f2"}, "80": {"freq": 1, "color": "#cfe1f2"}, "155": {"freq": 1, "color": "#cfe1f2"}}
    var listItems = document.querySelectorAll('#myDropdown_mrmr_residues_10 a');
    listItems.forEach(function (item) {
      toggleHighlight(item);
  
    });
  } else {
    var res_dict = {"136": {"freq": 40, "color": "#08306b", "amino_acid": "L"}, "333": {"freq": 40, "color": "#08306b", "amino_acid": "V"}, "142": {"freq": 31, "color": "#0f5aa3", "amino_acid": "P"}, "377": {"freq": 31, "color": "#0f5aa3", "amino_acid": "P"}, "387": {"freq": 22, "color": "#3383be", "amino_acid": "Y"}, "77": {"freq": 18, "color": "#4896c8", "amino_acid": "S"}, "357": {"freq": 17, "color": "#4e9aca", "amino_acid": "V"}, "318": {"freq": 16, "color": "#549ecd", "amino_acid": "E"}, "332": {"freq": 16, "color": "#549ecd", "amino_acid": "F"}, "162": {"freq": 15, "color": "#59a2cf", "amino_acid": "K"}, "166": {"freq": 13, "color": "#66aad4", "amino_acid": "L"}, "138": {"freq": 11, "color": "#73b2d7", "amino_acid": "G"}, "376": {"freq": 7, "color": "#90c2de", "amino_acid": "N"}, "95": {"freq": 7, "color": "#90c2de", "amino_acid": "V"}, "180": {"freq": 7, "color": "#90c2de", "amino_acid": "P"}, "391": {"freq": 6, "color": "#98c7df", "amino_acid": "F"}, "175": {"freq": 5, "color": "#9ecae1", "amino_acid": "V"}, "137": {"freq": 5, "color": "#9ecae1", "amino_acid": "Y"}, "323": {"freq": 5, "color": "#9ecae1", "amino_acid": "K"}, "347": {"freq": 5, "color": "#9ecae1", "amino_acid": "V"}, "229": {"freq": 4, "color": "#a5cde3", "amino_acid": "L"}, "149": {"freq": 4, "color": "#a5cde3", "amino_acid": "A"}, "125": {"freq": 4, "color": "#a5cde3", "amino_acid": "F"}, "351": {"freq": 4, "color": "#a5cde3", "amino_acid": "E"}, "181": {"freq": 3, "color": "#abcfe5", "amino_acid": "I"}, "121": {"freq": 3, "color": "#abcfe5", "amino_acid": "M"}, "240": {"freq": 3, "color": "#abcfe5", "amino_acid": "F"}, "334": {"freq": 3, "color": "#abcfe5", "amino_acid": "V"}, "326": {"freq": 3, "color": "#abcfe5", "amino_acid": "G"}, "195": {"freq": 3, "color": "#abcfe5", "amino_acid": "K"}, "115": {"freq": 3, "color": "#abcfe5", "amino_acid": "S"}, "91": {"freq": 3, "color": "#abcfe5", "amino_acid": "G"}, "250": {"freq": 3, "color": "#abcfe5", "amino_acid": "M"}, "83": {"freq": 2, "color": "#b0d1e7", "amino_acid": "V"}, "202": {"freq": 2, "color": "#b0d1e7", "amino_acid": "I"}, "206": {"freq": 2, "color": "#b0d1e7", "amino_acid": "I"}, "221": {"freq": 2, "color": "#b0d1e7", "amino_acid": "V"}, "110": {"freq": 2, "color": "#b0d1e7", "amino_acid": "N"}, "163": {"freq": 2, "color": "#b0d1e7", "amino_acid": "I"}, "98": {"freq": 2, "color": "#b0d1e7", "amino_acid": "A"}, "123": {"freq": 2, "color": "#b0d1e7", "amino_acid": "L"}, "244": {"freq": 1, "color": "#b6d4e9", "amino_acid": "F"}, "354": {"freq": 1, "color": "#b6d4e9", "amino_acid": "N"}, "236": {"freq": 1, "color": "#b6d4e9", "amino_acid": "L"}, "392": {"freq": 1, "color": "#b6d4e9", "amino_acid": "S"}, "113": {"freq": 1, "color": "#b6d4e9", "amino_acid": "L"}, "255": {"freq": 1, "color": "#b6d4e9", "amino_acid": "F"}, "85": {"freq": 1, "color": "#b6d4e9", "amino_acid": "I"}, "246": {"freq": 1, "color": "#b6d4e9", "amino_acid": "P"}, "384": {"freq": 1, "color": "#b6d4e9", "amino_acid": "N"}, "173": {"freq": 1, "color": "#b6d4e9", "amino_acid": "R"}, "74": {"freq": 1, "color": "#b6d4e9", "amino_acid": "K"}, "322": {"freq": 1, "color": "#b6d4e9", "amino_acid": "C"}, "176": {"freq": 1, "color": "#b6d4e9", "amino_acid": "A"}, "79": {"freq": 1, "color": "#b6d4e9", "amino_acid": "L"}, "275": {"freq": 1, "color": "#b6d4e9", "amino_acid": "R"}, "178": {"freq": 1, "color": "#b6d4e9", "amino_acid": "Q"}, "216": {"freq": 1, "color": "#b6d4e9", "amino_acid": "Q"}, "159": {"freq": 1, "color": "#b6d4e9", "amino_acid": "S"}, "127": {"freq": 1, "color": "#b6d4e9", "amino_acid": "V"}, "249": {"freq": 1, "color": "#b6d4e9", "amino_acid": "I"}, "102": {"freq": 1, "color": "#b6d4e9", "amino_acid": "E"}, "184": {"freq": 1, "color": "#b6d4e9", "amino_acid": "S"}, "192": {"freq": 1, "color": "#b6d4e9", "amino_acid": "A"}, "358": {"freq": 1, "color": "#b6d4e9", "amino_acid": "I"}};
    var listItems = document.querySelectorAll('#myDropdown_sfm_lgb_residues_10 a');
    listItems.forEach(function (item) {
      toggleHighlight(item);
  
    });
  }
    // original_title = $('#'+plotid).find("#"+key).attr('original_title')


    // $('#'+plotid).find("#"+key).attr('title',original_title+extra);
    // $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);
    
    // $("circle").tooltip('fixTitle');
    // $("text").tooltip('fixTitle');

    console.log('Key:');
    $.each(res_dict, function(key, value) {
      var frequency = value.freq;
      var color = value.color;
      
      console.log('Key:', key);
      console.log('Frequency:', frequency);
      console.log('Color:', color);
      $('#'+plotid).find("#"+key).css("fill", color);

      // You can perform additional operations here with frequency and color
    });

}

function distance_interaction(plotid, typeFS) {

  resetColorsAndUnhighlight(plotid);

  if (typeFS == "com_mrmr_10" ) {
    var pair_dict = {"(179, 336)": {"freq": 37, "color": "#0000FFFF", "amino_acid1": "N", "amino_acid2": "W"}, "(153, 159)": {"freq": 17, "color": "#FF00008D", "amino_acid1": "Y", "amino_acid2": "S"}, "(204, 238)": {"freq": 10, "color": "#2A7E2A66", "amino_acid1": "V", "amino_acid2": "G"}, "(92, 98)": {"freq": 9, "color": "#BCF2B060", "amino_acid1": "N", "amino_acid2": "A"}, "(206, 212)": {"freq": 8, "color": "#6182165A", "amino_acid1": "I", "amino_acid2": "V"}, "(265, 266)": {"freq": 5, "color": "#D30C5B49", "amino_acid1": "A", "amino_acid2": "T"}, "(166, 336)": {"freq": 4, "color": "#0000FF44", "amino_acid1": "L", "amino_acid2": "W"}, "(197, 238)": {"freq": 4, "color": "#2A7E2A44", "amino_acid1": "I", "amino_acid2": "G"}, "(188, 193)": {"freq": 4, "color": "#7733C244", "amino_acid1": "S", "amino_acid2": "F"}, "(313, 336)": {"freq": 4, "color": "#0000FF44", "amino_acid1": "Q", "amino_acid2": "W"}, "(190, 336)": {"freq": 3, "color": "#0000FF3E", "amino_acid1": "T", "amino_acid2": "W"}, "(143, 372)": {"freq": 3, "color": "#7522103E", "amino_acid1": "L", "amino_acid2": "S"}, "(193, 202)": {"freq": 3, "color": "#7733C23E", "amino_acid1": "F", "amino_acid2": "I"}, "(179, 332)": {"freq": 3, "color": "#0000FF3E", "amino_acid1": "N", "amino_acid2": "F"}, "(318, 336)": {"freq": 3, "color": "#0000FF3E", "amino_acid1": "E", "amino_acid2": "W"}, "(115, 398)": {"freq": 3, "color": "#6F770D3E", "amino_acid1": "S", "amino_acid2": "Q"}, "(180, 184)": {"freq": 3, "color": "#23AE063E", "amino_acid1": "P", "amino_acid2": "S"}, "(143, 371)": {"freq": 3, "color": "#7522103E", "amino_acid1": "L", "amino_acid2": "L"}, "(197, 201)": {"freq": 3, "color": "#2A7E2A3E", "amino_acid1": "I", "amino_acid2": "T"}, "(245, 246)": {"freq": 3, "color": "#5CDFFB3E", "amino_acid1": "I", "amino_acid2": "P"}, "(144, 371)": {"freq": 3, "color": "#7522103E", "amino_acid1": "P", "amino_acid2": "L"}, "(197, 336)": {"freq": 3, "color": "#2A7E2A3E", "amino_acid1": "I", "amino_acid2": "W"}, "(160, 398)": {"freq": 2, "color": "#6F770D38", "amino_acid1": "T", "amino_acid2": "Q"}, "(169, 243)": {"freq": 2, "color": "#C4FDCC38", "amino_acid1": "I", "amino_acid2": "F"}, "(193, 235)": {"freq": 2, "color": "#7733C238", "amino_acid1": "F", "amino_acid2": "V"}, "(142, 162)": {"freq": 2, "color": "#DFF80E38", "amino_acid1": "P", "amino_acid2": "K"}, "(170, 336)": {"freq": 2, "color": "#2A7E2A38", "amino_acid1": "S", "amino_acid2": "W"}, "(90, 95)": {"freq": 2, "color": "#83BC5538", "amino_acid1": "A", "amino_acid2": "V"}, "(357, 361)": {"freq": 2, "color": "#B5D8D238", "amino_acid1": "V", "amino_acid2": "L"}, "(143, 384)": {"freq": 2, "color": "#75221038", "amino_acid1": "L", "amino_acid2": "N"}, "(180, 185)": {"freq": 2, "color": "#23AE0638", "amino_acid1": "P", "amino_acid2": "R"}, "(143, 370)": {"freq": 2, "color": "#75221038", "amino_acid1": "L", "amino_acid2": "Y"}, "(166, 397)": {"freq": 2, "color": "#0000FF38", "amino_acid1": "L", "amino_acid2": "C"}, "(111, 205)": {"freq": 2, "color": "#0AC2F438", "amino_acid1": "Y", "amino_acid2": "G"}, "(159, 161)": {"freq": 2, "color": "#FF000038", "amino_acid1": "S", "amino_acid2": "A"}, "(209, 212)": {"freq": 2, "color": "#61821638", "amino_acid1": "P", "amino_acid2": "V"}, "(374, 379)": {"freq": 2, "color": "#E298DB38", "amino_acid1": "A", "amino_acid2": "V"}, "(178, 184)": {"freq": 2, "color": "#23AE0638", "amino_acid1": "Q", "amino_acid2": "S"}, "(118, 166)": {"freq": 2, "color": "#0000FF38", "amino_acid1": "I", "amino_acid2": "L"}, "(143, 177)": {"freq": 2, "color": "#75221038", "amino_acid1": "L", "amino_acid2": "I"}, "(267, 313)": {"freq": 2, "color": "#0000FF38", "amino_acid1": "L", "amino_acid2": "Q"}, "(216, 235)": {"freq": 2, "color": "#7733C238", "amino_acid1": "Q", "amino_acid2": "V"}, "(197, 202)": {"freq": 2, "color": "#2A7E2A38", "amino_acid1": "I", "amino_acid2": "I"}, "(172, 336)": {"freq": 2, "color": "#2A7E2A38", "amino_acid1": "D", "amino_acid2": "W"}, "(137, 140)": {"freq": 2, "color": "#03B49838", "amino_acid1": "Y", "amino_acid2": "R"}, "(193, 201)": {"freq": 2, "color": "#7733C238", "amino_acid1": "F", "amino_acid2": "T"}, "(189, 193)": {"freq": 2, "color": "#7733C238", "amino_acid1": "R", "amino_acid2": "F"}, "(211, 215)": {"freq": 2, "color": "#F87A8C38", "amino_acid1": "P", "amino_acid2": "L"}, "(107, 193)": {"freq": 1, "color": "#7733C233", "amino_acid1": "N", "amino_acid2": "F"}, "(176, 179)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "A", "amino_acid2": "N"}, "(142, 372)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "P", "amino_acid2": "S"}, "(256, 268)": {"freq": 1, "color": "#C0CB6533", "amino_acid1": "L", "amino_acid2": "C"}, "(149, 159)": {"freq": 1, "color": "#FF000033", "amino_acid1": "A", "amino_acid2": "S"}, "(216, 338)": {"freq": 1, "color": "#7733C233", "amino_acid1": "Q", "amino_acid2": "P"}, "(183, 331)": {"freq": 1, "color": "#EB3FC133", "amino_acid1": "H", "amino_acid2": "L"}, "(83, 92)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "V", "amino_acid2": "N"}, "(165, 239)": {"freq": 1, "color": "#7E86DB33", "amino_acid1": "H", "amino_acid2": "S"}, "(254, 265)": {"freq": 1, "color": "#D30C5B33", "amino_acid1": "Y", "amino_acid2": "A"}, "(148, 193)": {"freq": 1, "color": "#7733C233", "amino_acid1": "C", "amino_acid2": "F"}, "(318, 335)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "E", "amino_acid2": "M"}, "(87, 119)": {"freq": 1, "color": "#2EF0B233", "amino_acid1": "L", "amino_acid2": "A"}, "(124, 215)": {"freq": 1, "color": "#F87A8C33", "amino_acid1": "G", "amino_acid2": "L"}, "(111, 165)": {"freq": 1, "color": "#0AC2F433", "amino_acid1": "Y", "amino_acid2": "H"}, "(71, 362)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "L", "amino_acid2": "L"}, "(92, 356)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "N", "amino_acid2": "D"}, "(113, 114)": {"freq": 1, "color": "#9C1E3233", "amino_acid1": "L", "amino_acid2": "M"}, "(143, 373)": {"freq": 1, "color": "#75221033", "amino_acid1": "L", "amino_acid2": "S"}, "(318, 332)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "E", "amino_acid2": "F"}, "(182, 184)": {"freq": 1, "color": "#23AE0633", "amino_acid1": "H", "amino_acid2": "S"}, "(193, 385)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "K"}, "(275, 353)": {"freq": 1, "color": "#89145933", "amino_acid1": "R", "amino_acid2": "C"}, "(73, 368)": {"freq": 1, "color": "#03241E33", "amino_acid1": "E", "amino_acid2": "I"}, "(157, 396)": {"freq": 1, "color": "#FDA65D33", "amino_acid1": "L", "amino_acid2": "Q"}, "(142, 179)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "P", "amino_acid2": "N"}, "(116, 196)": {"freq": 1, "color": "#5B369833", "amino_acid1": "L", "amino_acid2": "I"}, "(193, 206)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "I"}, "(126, 215)": {"freq": 1, "color": "#F87A8C33", "amino_acid1": "L", "amino_acid2": "L"}, "(145, 371)": {"freq": 1, "color": "#75221033", "amino_acid1": "S", "amino_acid2": "L"}, "(191, 377)": {"freq": 1, "color": "#01C78733", "amino_acid1": "K", "amino_acid2": "P"}, "(313, 364)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "Q", "amino_acid2": "V"}, "(167, 265)": {"freq": 1, "color": "#D30C5B33", "amino_acid1": "C", "amino_acid2": "A"}, "(198, 243)": {"freq": 1, "color": "#C4FDCC33", "amino_acid1": "A", "amino_acid2": "F"}, "(220, 360)": {"freq": 1, "color": "#8EF86D33", "amino_acid1": "K", "amino_acid2": "A"}, "(183, 211)": {"freq": 1, "color": "#EB3FC133", "amino_acid1": "H", "amino_acid2": "P"}, "(88, 143)": {"freq": 1, "color": "#75221033", "amino_acid1": "T", "amino_acid2": "L"}, "(158, 161)": {"freq": 1, "color": "#FF000033", "amino_acid1": "F", "amino_acid2": "A"}, "(169, 336)": {"freq": 1, "color": "#C4FDCC33", "amino_acid1": "I", "amino_acid2": "W"}, "(193, 232)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "D"}, "(212, 215)": {"freq": 1, "color": "#61821633", "amino_acid1": "V", "amino_acid2": "L"}, "(193, 257)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "T"}, "(265, 275)": {"freq": 1, "color": "#D30C5B33", "amino_acid1": "A", "amino_acid2": "R"}, "(162, 207)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "K", "amino_acid2": "S"}, "(176, 336)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "A", "amino_acid2": "W"}, "(83, 143)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "V", "amino_acid2": "L"}, "(85, 372)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "I", "amino_acid2": "S"}, "(376, 381)": {"freq": 1, "color": "#5487D833", "amino_acid1": "N", "amino_acid2": "T"}, "(183, 227)": {"freq": 1, "color": "#EB3FC133", "amino_acid1": "H", "amino_acid2": "C"}, "(105, 384)": {"freq": 1, "color": "#75221033", "amino_acid1": "L", "amino_acid2": "N"}, "(253, 258)": {"freq": 1, "color": "#58265033", "amino_acid1": "T", "amino_acid2": "I"}, "(142, 378)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "P", "amino_acid2": "L"}, "(193, 386)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "T"}, "(160, 204)": {"freq": 1, "color": "#6F770D33", "amino_acid1": "T", "amino_acid2": "V"}, "(193, 265)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "A"}, "(143, 166)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "L", "amino_acid2": "L"}, "(336, 350)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "W", "amino_acid2": "K"}, "(193, 214)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "G"}, "(140, 386)": {"freq": 1, "color": "#03B49833", "amino_acid1": "R", "amino_acid2": "T"}, "(151, 177)": {"freq": 1, "color": "#75221033", "amino_acid1": "W", "amino_acid2": "I"}, "(87, 191)": {"freq": 1, "color": "#2EF0B233", "amino_acid1": "L", "amino_acid2": "K"}, "(246, 253)": {"freq": 1, "color": "#5CDFFB33", "amino_acid1": "P", "amino_acid2": "T"}, "(315, 332)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "I", "amino_acid2": "F"}, "(94, 207)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "L", "amino_acid2": "S"}, "(111, 183)": {"freq": 1, "color": "#0AC2F433", "amino_acid1": "Y", "amino_acid2": "H"}, "(141, 196)": {"freq": 1, "color": "#5B369833", "amino_acid1": "W", "amino_acid2": "I"}, "(196, 398)": {"freq": 1, "color": "#5B369833", "amino_acid1": "I", "amino_acid2": "Q"}, "(260, 321)": {"freq": 1, "color": "#562B9133", "amino_acid1": "S", "amino_acid2": "A"}, "(376, 378)": {"freq": 1, "color": "#5487D833", "amino_acid1": "N", "amino_acid2": "L"}, "(163, 320)": {"freq": 1, "color": "#CD892133", "amino_acid1": "I", "amino_acid2": "K"}, "(92, 103)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "N", "amino_acid2": "K"}, "(129, 190)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "P", "amino_acid2": "T"}, "(193, 390)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "A"}, "(71, 76)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "L", "amino_acid2": "W"}, "(193, 212)": {"freq": 1, "color": "#7733C233", "amino_acid1": "F", "amino_acid2": "V"}, "(142, 388)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "P", "amino_acid2": "R"}, "(183, 368)": {"freq": 1, "color": "#0AC2F433", "amino_acid1": "H", "amino_acid2": "I"}, "(95, 98)": {"freq": 1, "color": "#83BC5533", "amino_acid1": "V", "amino_acid2": "A"}, "(231, 265)": {"freq": 1, "color": "#7733C233", "amino_acid1": "D", "amino_acid2": "A"}, "(155, 163)": {"freq": 1, "color": "#CD892133", "amino_acid1": "D", "amino_acid2": "I"}, "(228, 376)": {"freq": 1, "color": "#5487D833", "amino_acid1": "L", "amino_acid2": "N"}, "(158, 163)": {"freq": 1, "color": "#FF000033", "amino_acid1": "F", "amino_acid2": "I"}, "(123, 191)": {"freq": 1, "color": "#2EF0B233", "amino_acid1": "L", "amino_acid2": "K"}, "(143, 369)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "L", "amino_acid2": "G"}, "(112, 256)": {"freq": 1, "color": "#C0CB6533", "amino_acid1": "F", "amino_acid2": "L"}, "(159, 211)": {"freq": 1, "color": "#FF000033", "amino_acid1": "S", "amino_acid2": "P"}, "(91, 190)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "G", "amino_acid2": "T"}, "(144, 182)": {"freq": 1, "color": "#75221033", "amino_acid1": "P", "amino_acid2": "H"}, "(113, 137)": {"freq": 1, "color": "#9C1E3233", "amino_acid1": "L", "amino_acid2": "Y"}, "(250, 381)": {"freq": 1, "color": "#5487D833", "amino_acid1": "M", "amino_acid2": "T"}, "(141, 391)": {"freq": 1, "color": "#5B369833", "amino_acid1": "W", "amino_acid2": "F"}, "(313, 314)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "Q", "amino_acid2": "S"}, "(105, 193)": {"freq": 1, "color": "#75221033", "amino_acid1": "L", "amino_acid2": "F"}, "(207, 238)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "S", "amino_acid2": "G"}, "(149, 151)": {"freq": 1, "color": "#FF000033", "amino_acid1": "A", "amino_acid2": "W"},  "(89, 95)": {"freq": 1, "color": "#83BC5533", "amino_acid1": "I", "amino_acid2": "V"}, "(178, 245)": {"freq": 1, "color": "#23AE0633", "amino_acid1": "Q", "amino_acid2": "I"}, "(184, 223)": {"freq": 1, "color": "#23AE0633", "amino_acid1": "S", "amino_acid2": "K"}, "(124, 235)": {"freq": 1, "color": "#F87A8C33", "amino_acid1": "G", "amino_acid2": "V"}, "(194, 336)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "L", "amino_acid2": "W"}, "(197, 242)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "I", "amino_acid2": "S"}, "(193, 326)": {"freq": 1, "color": "#75221033", "amino_acid1": "F", "amino_acid2": "G"}, "(153, 193)": {"freq": 1, "color": "#FF000033", "amino_acid1": "Y", "amino_acid2": "F"}, "(86, 227)": {"freq": 1, "color": "#EB3FC133", "amino_acid1": "I", "amino_acid2": "C"}, "(94, 338)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "L", "amino_acid2": "P"}, "(387, 397)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "Y", "amino_acid2": "C"}, "(126, 144)": {"freq": 1, "color": "#F87A8C33", "amino_acid1": "L", "amino_acid2": "P"}, "(102, 200)": {"freq": 1, "color": "#D88D1633", "amino_acid1": "E", "amino_acid2": "W"}, "(104, 193)": {"freq": 1, "color": "#FF000033", "amino_acid1": "K", "amino_acid2": "F"}, "(114, 398)": {"freq": 1, "color": "#9C1E3233", "amino_acid1": "M", "amino_acid2": "Q"}, "(173, 241)": {"freq": 1, "color": "#BA14B733", "amino_acid1": "R", "amino_acid2": "V"}, "(103, 142)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "K", "amino_acid2": "P"}, "(195, 215)": {"freq": 1, "color": "#61821633", "amino_acid1": "K", "amino_acid2": "L"}, "(92, 112)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "N", "amino_acid2": "F"}, "(137, 226)": {"freq": 1, "color": "#9C1E3233", "amino_acid1": "Y", "amino_acid2": "S"}, "(142, 191)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "P", "amino_acid2": "K"}, "(193, 319)": {"freq": 1, "color": "#FF000033", "amino_acid1": "F", "amino_acid2": "Q"}, "(84, 347)": {"freq": 1, "color": "#377F6233", "amino_acid1": "V", "amino_acid2": "V"}, "(157, 398)": {"freq": 1, "color": "#FDA65D33", "amino_acid1": "L", "amino_acid2": "Q"}, "(53, 188)": {"freq": 1, "color": "#7733C233", "amino_acid1": "T", "amino_acid2": "S"}, "(148, 161)": {"freq": 1, "color": "#7733C233", "amino_acid1": "C", "amino_acid2": "A"}, "(220, 364)": {"freq": 1, "color": "#8EF86D33", "amino_acid1": "K", "amino_acid2": "V"}, "(197, 206)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "I", "amino_acid2": "I"}, "(200, 397)": {"freq": 1, "color": "#D88D1633", "amino_acid1": "W", "amino_acid2": "C"}, "(228, 378)": {"freq": 1, "color": "#5487D833", "amino_acid1": "L", "amino_acid2": "L"}, "(357, 365)": {"freq": 1, "color": "#B5D8D233", "amino_acid1": "V", "amino_acid2": "F"}, "(246, 268)": {"freq": 1, "color": "#5CDFFB33", "amino_acid1": "P", "amino_acid2": "C"}, "(116, 190)": {"freq": 1, "color": "#5B369833", "amino_acid1": "L", "amino_acid2": "T"}, "(82, 191)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "A", "amino_acid2": "K"}, "(97, 396)": {"freq": 1, "color": "#FDA65D33", "amino_acid1": "M", "amino_acid2": "Q"}, "(76, 130)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "W", "amino_acid2": "V"}, "(107, 197)": {"freq": 1, "color": "#7733C233", "amino_acid1": "N", "amino_acid2": "I"}, "(197, 210)": {"freq": 1, "color": "#7733C233", "amino_acid1": "I", "amino_acid2": "I"}, "(130, 144)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "V", "amino_acid2": "P"}, "(235, 265)": {"freq": 1, "color": "#F87A8C33", "amino_acid1": "V", "amino_acid2": "A"}, "(374, 386)": {"freq": 1, "color": "#E298DB33", "amino_acid1": "A", "amino_acid2": "T"}, "(142, 371)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "P", "amino_acid2": "L"}, "(168, 243)": {"freq": 1, "color": "#C4FDCC33", "amino_acid1": "A", "amino_acid2": "F"}, "(85, 95)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "I", "amino_acid2": "V"}, "(90, 151)": {"freq": 1, "color": "#83BC5533", "amino_acid1": "A", "amino_acid2": "W"}, "(133, 372)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "L", "amino_acid2": "S"}, "(102, 398)": {"freq": 1, "color": "#D88D1633", "amino_acid1": "E", "amino_acid2": "Q"}, "(352, 355)": {"freq": 1, "color": "#34069133", "amino_acid1": "S", "amino_acid2": "E"}, "(177, 336)": {"freq": 1, "color": "#8EF86D33", "amino_acid1": "K", "amino_acid2": "V"}, "(197, 206)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "I", "amino_acid2": "I"}, "(200, 397)": {"freq": 1, "color": "#D88D1633", "amino_acid1": "W", "amino_acid2": "C"}, "(228, 378)": {"freq": 1, "color": "#5487D833", "amino_acid1": "L", "amino_acid2": "L"}, "(357, 365)": {"freq": 1, "color": "#B5D8D233", "amino_acid1": "V", "amino_acid2": "F"}, "(246, 268)": {"freq": 1, "color": "#5CDFFB33", "amino_acid1": "P", "amino_acid2": "C"}, "(116, 190)": {"freq": 1, "color": "#5B369833", "amino_acid1": "L", "amino_acid2": "T"}, "(82, 191)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "A", "amino_acid2": "K"}, "(97, 396)": {"freq": 1, "color": "#FDA65D33", "amino_acid1": "M", "amino_acid2": "Q"}, "(76, 130)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "W", "amino_acid2": "V"}, "(107, 197)": {"freq": 1, "color": "#7733C233", "amino_acid1": "N", "amino_acid2": "I"}, "(197, 210)": {"freq": 1, "color": "#7733C233", "amino_acid1": "I", "amino_acid2": "I"}, "(130, 144)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "V", "amino_acid2": "P"}, "(235, 265)": {"freq": 1, "color": "#F87A8C33", "amino_acid1": "V", "amino_acid2": "A"}, "(374, 386)": {"freq": 1, "color": "#E298DB33", "amino_acid1": "A", "amino_acid2": "T"}, "(142, 371)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "P", "amino_acid2": "L"}, "(168, 243)": {"freq": 1, "color": "#C4FDCC33", "amino_acid1": "A", "amino_acid2": "F"}, "(85, 95)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "I", "amino_acid2": "V"}, "(90, 151)": {"freq": 1, "color": "#83BC5533", "amino_acid1": "A", "amino_acid2": "W"}, "(133, 372)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "L", "amino_acid2": "S"}, "(102, 398)": {"freq": 1, "color": "#D88D1633", "amino_acid1": "E", "amino_acid2": "Q"}, "(352, 355)": {"freq": 1, "color": "#34069133", "amino_acid1": "S", "amino_acid2": "E"}, "(177, 336)": {"freq": 1, "color": "#75221033", "amino_acid1": "I", "amino_acid2": "W"}, "(169, 246)": {"freq": 1, "color": "#C4FDCC33", "amino_acid1": "I", "amino_acid2": "P"}, "(142, 193)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "P", "amino_acid2": "F"}, "(76, 183)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "W", "amino_acid2": "H"}, "(95, 246)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "V", "amino_acid2": "P"}, "(244, 267)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "F", "amino_acid2": "L"}, "(150, 197)": {"freq": 1, "color": "#7733C233", "amino_acid1": "V", "amino_acid2": "I"}, "(128, 141)": {"freq": 1, "color": "#5B369833", "amino_acid1": "M", "amino_acid2": "W"}, "(165, 243)": {"freq": 1, "color": "#0AC2F433", "amino_acid1": "H", "amino_acid2": "F"}, "(147, 371)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "L", "amino_acid2": "L"}, "(116, 194)": {"freq": 1, "color": "#5B369833", "amino_acid1": "L", "amino_acid2": "L"}, "(247, 249)": {"freq": 1, "color": "#ACC28E33", "amino_acid1": "L", "amino_acid2": "I"}, "(209, 393)": {"freq": 1, "color": "#61821633", "amino_acid1": "P", "amino_acid2": "R"}, "(207, 398)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "S", "amino_acid2": "Q"}, "(216, 344)": {"freq": 1, "color": "#7733C233", "amino_acid1": "Q", "amino_acid2": "I"}, "(79, 190)": {"freq": 1, "color": "#5B369833", "amino_acid1": "L", "amino_acid2": "T"}, "(143, 170)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "L", "amino_acid2": "S"}, "(147, 184)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "L", "amino_acid2": "S"}, "(203, 242)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "S", "amino_acid2": "S"}, "(119, 190)": {"freq": 1, "color": "#2EF0B233", "amino_acid1": "A", "amino_acid2": "T"}, "(256, 313)": {"freq": 1, "color": "#C0CB6533", "amino_acid1": "L", "amino_acid2": "Q"}, "(160, 203)": {"freq": 1, "color": "#6F770D33", "amino_acid1": "T", "amino_acid2": "S"}, "(114, 184)": {"freq": 1, "color": "#9C1E3233", "amino_acid1": "M", "amino_acid2": "S"}, "(77, 371)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "S", "amino_acid2": "L"}, "(70, 71)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "H", "amino_acid2": "L"}, "(168, 247)": {"freq": 1, "color": "#C4FDCC33", "amino_acid1": "A", "amino_acid2": "L"}, "(160, 395)": {"freq": 1, "color": "#6F770D33", "amino_acid1": "T", "amino_acid2": "I"}, "(93, 141)": {"freq": 1, "color": "#5B369833", "amino_acid1": "I", "amino_acid2": "W"}, "(192, 336)": {"freq": 1, "color": "#75221033", "amino_acid1": "A", "amino_acid2": "W"}, "(114, 166)": {"freq": 1, "color": "#9C1E3233", "amino_acid1": "M", "amino_acid2": "L"}, "(82, 143)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "A", "amino_acid2": "L"}, "(77, 184)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "S", "amino_acid2": "S"}, "(141, 373)": {"freq": 1, "color": "#5B369833", "amino_acid1": "W", "amino_acid2": "S"}, "(163, 243)": {"freq": 1, "color": "#FF000033", "amino_acid1": "I", "amino_acid2": "F"}, "(149, 226)": {"freq": 1, "color": "#FF000033", "amino_acid1": "A", "amino_acid2": "S"}, "(123, 151)": {"freq": 1, "color": "#2EF0B233", "amino_acid1": "L", "amino_acid2": "W"}, "(163, 232)": {"freq": 1, "color": "#FF000033", "amino_acid1": "I", "amino_acid2": "D"}, "(144, 378)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "P", "amino_acid2": "L"}, "(193, 262)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "F", "amino_acid2": "Q"}, "(220, 357)": {"freq": 1, "color": "#8EF86D33", "amino_acid1": "K", "amino_acid2": "V"}, "(340, 346)": {"freq": 1, "color": "#CCBFE033", "amino_acid1": "F", "amino_acid2": "A"}, "(209, 211)": {"freq": 1, "color": "#61821633", "amino_acid1": "P", "amino_acid2": "P"}, "(111, 197)": {"freq": 1, "color": "#0AC2F433", "amino_acid1": "Y", "amino_acid2": "I"}, "(313, 359)": {"freq": 1, "color": "#C0CB6533", "amino_acid1": "Q", "amino_acid2": "G"}, "(116, 398)": {"freq": 1, "color": "#5B369833", "amino_acid1": "L", "amino_acid2": "Q"}, "(115, 165)": {"freq": 1, "color": "#6F770D33", "amino_acid1": "S", "amino_acid2": "H"}, "(184, 336)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "S", "amino_acid2": "W"}, "(144, 193)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "P", "amino_acid2": "F"}, "(202, 212)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "I", "amino_acid2": "V"}, "(71, 184)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "L", "amino_acid2": "S"}, "(167, 243)": {"freq": 1, "color": "#D30C5B33", "amino_acid1": "C", "amino_acid2": "F"}, "(275, 312)": {"freq": 1, "color": "#D30C5B33", "amino_acid1": "R", "amino_acid2": "M"}, "(193, 242)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "F", "amino_acid2": "S"}, "(166, 394)": {"freq": 1, "color": "#9C1E3233", "amino_acid1": "L", "amino_acid2": "Y"}, "(115, 141)": {"freq": 1, "color": "#6F770D33", "amino_acid1": "S", "amino_acid2": "W"}, "(144, 184)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "P", "amino_acid2": "S"}, "(200, 398)": {"freq": 1, "color": "#D88D1633", "amino_acid1": "W", "amino_acid2": "Q"}, "(74, 191)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "K", "amino_acid2": "K"}, "(193, 226)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "F", "amino_acid2": "S"}, "(183, 360)": {"freq": 1, "color": "#A5800D33", "amino_acid1": "H", "amino_acid2": "A"}, "(259, 263)": {"freq": 1, "color": "#7D2C8E33", "amino_acid1": "K", "amino_acid2": "K"}, "(101, 167)": {"freq": 1, "color": "#D30C5B33", "amino_acid1": "L", "amino_acid2": "C"}, "(149, 193)": {"freq": 1, "color": "#FF000033", "amino_acid1": "A", "amino_acid2": "F"}, "(74, 367)": {"freq": 1, "color": "#BCF2B033", "amino_acid1": "K", "amino_acid2": "W"}, "(94, 228)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "L", "amino_acid2": "L"}, "(94, 117)": {"freq": 1, "color": "#DFF80E33", "amino_acid1": "L", "amino_acid2": "A"}, "(84, 389)": {"freq": 1, "color": "#377F6233", "amino_acid1": "V", "amino_acid2": "S"}};
    var listItems = document.querySelectorAll('#myDropdown_mrmr_com_10 a');
    listItems.forEach(function (item) {
      toggleHighlight(item);
  
    });
  } else if (typeFS == "com_mrmr_1" ) {
    var pair_dict = {"(179, 336)": {"freq": 31, "color": "#0000FFFF", "amino_acid1": "N", "amino_acid2": "W"}, "(197, 336)": {"freq": 3, "color": "#0000FF58", "amino_acid1": "Y", "amino_acid2": "S"}, "(190, 336)": {"freq": 2, "color": "#0000FF52", "amino_acid1": "V", "amino_acid2": "G"}, "(204, 238)": {"freq": 1, "color": "#E1E7264C", "amino_acid1": "N", "amino_acid2": "A"}, "(322, 332)": {"freq": 1, "color": "#3778914C", "amino_acid1": "I", "amino_acid2": "V"}, "(143, 373)": {"freq": 1, "color": "#9C100E4C", "amino_acid1": "A", "amino_acid2": "T"}, "(193, 223)": {"freq": 1, "color": "#F672E34C", "amino_acid1": "L", "amino_acid2": "W"}};
    var listItems = document.querySelectorAll('#myDropdown_mrmr_com_1 a');
    listItems.forEach(function (item) {
      toggleHighlight(item);
  
    });
  } else if (typeFS == "ca_mrmr_10" ) {
    var pair_dict = {"(93, 329)": {"freq": 16, "color": "#FF0000FF", "amino_acid1": "I", "amino_acid2": "F"}, "(153, 159)": {"freq": 12, "color": "#0000FFC8", "amino_acid1": "Y", "amino_acid2": "S"}, "(92, 98)": {"freq": 11, "color": "#2A7E2ABB", "amino_acid1": "N", "amino_acid2": "A"}, "(326, 328)": {"freq": 8, "color": "#268F6192", "amino_acid1": "G", "amino_acid2": "V"}, "(204, 238)": {"freq": 8, "color": "#0A0D3C92", "amino_acid1": "V", "amino_acid2": "G"}, "(159, 204)": {"freq": 7, "color": "#0000FF84", "amino_acid1": "S", "amino_acid2": "V"}, "(159, 216)": {"freq": 7, "color": "#0000FF84", "amino_acid1": "S", "amino_acid2": "Q"}, "(336, 350)": {"freq": 6, "color": "#2CACC677", "amino_acid1": "W", "amino_acid2": "K"}, "(179, 336)": {"freq": 5, "color": "#2CACC669", "amino_acid1": "N", "amino_acid2": "W"}, "(143, 163)": {"freq": 5, "color": "#6624AC69", "amino_acid1": "L", "amino_acid2": "I"}, "(326, 330)": {"freq": 5, "color": "#268F6169", "amino_acid1": "G", "amino_acid2": "F"}, "(184, 188)": {"freq": 4, "color": "#1D97F35B", "amino_acid1": "S", "amino_acid2": "S"}, "(143, 371)": {"freq": 4, "color": "#6624AC5B", "amino_acid1": "L", "amino_acid2": "L"}, "(357, 362)": {"freq": 4, "color": "#A8635A5B", "amino_acid1": "V", "amino_acid2": "L"}, "(81, 82)": {"freq": 4, "color": "#5D92775B", "amino_acid1": "T", "amino_acid2": "A"}, "(357, 366)": {"freq": 4, "color": "#A8635A5B", "amino_acid1": "V", "amino_acid2": "V"}, "(357, 361)": {"freq": 4, "color": "#A8635A5B", "amino_acid1": "V", "amino_acid2": "L"}, "(92, 95)": {"freq": 3, "color": "#2A7E2A4E", "amino_acid1": "N", "amino_acid2": "V"}, "(142, 192)": {"freq": 3, "color": "#7EE7574E", "amino_acid1": "P", "amino_acid2": "A"}, "(255, 258)": {"freq": 3, "color": "#A9971B4E", "amino_acid1": "F", "amino_acid2": "I"}, "(115, 190)": {"freq": 3, "color": "#95D9214E", "amino_acid1": "S", "amino_acid2": "T"}, "(179, 184)": {"freq": 3, "color": "#2CACC64E", "amino_acid1": "N", "amino_acid2": "S"}, "(128, 144)": {"freq": 3, "color": "#4DBB644E", "amino_acid1": "M", "amino_acid2": "P"}, "(260, 321)": {"freq": 3, "color": "#04BA164E", "amino_acid1": "S", "amino_acid2": "A"}, "(143, 370)": {"freq": 3, "color": "#6624AC4E", "amino_acid1": "L", "amino_acid2": "Y"}, "(260, 313)": {"freq": 3, "color": "#04BA164E", "amino_acid1": "S", "amino_acid2": "Q"}, "(239, 265)": {"freq": 3, "color": "#6BF7954E", "amino_acid1": "S", "amino_acid2": "A"}, "(104, 105)": {"freq": 3, "color": "#1002174E", "amino_acid1": "K", "amino_acid2": "L"}, "(357, 365)": {"freq": 3, "color": "#A8635A4E", "amino_acid1": "V", "amino_acid2": "F"}, "(234, 235)": {"freq": 3, "color": "#6A3A1E4E", "amino_acid1": "F", "amino_acid2": "V"}, "(92, 103)": {"freq": 2, "color": "#2A7E2A40", "amino_acid1": "N", "amino_acid2": "K"}, "(233, 265)": {"freq": 2, "color": "#6BF79540", "amino_acid1": "N", "amino_acid2": "A"}, "(160, 204)": {"freq": 2, "color": "#0000FF40", "amino_acid1": "T", "amino_acid2": "V"}, "(115, 164)": {"freq": 2, "color": "#95D92140", "amino_acid1": "S", "amino_acid2": "W"}, "(182, 185)": {"freq": 2, "color": "#293E8A40", "amino_acid1": "H", "amino_acid2": "R"}, "(143, 179)": {"freq": 2, "color": "#6624AC40", "amino_acid1": "L", "amino_acid2": "N"}, "(264, 313)": {"freq": 2, "color": "#04BA1640", "amino_acid1": "E", "amino_acid2": "Q"}, "(336, 359)": {"freq": 2, "color": "#2CACC640", "amino_acid1": "W", "amino_acid2": "G"}, "(117, 329)": {"freq": 2, "color": "#FF000040", "amino_acid1": "A", "amino_acid2": "F"}, "(207, 398)": {"freq": 2, "color": "#E1319E40", "amino_acid1": "S", "amino_acid2": "Q"}, "(115, 165)": {"freq": 2, "color": "#95D92140", "amino_acid1": "S", "amino_acid2": "H"}, "(327, 350)": {"freq": 2, "color": "#2CACC640", "amino_acid1": "I", "amino_acid2": "K"}, "(201, 238)": {"freq": 2, "color": "#0A0D3C40", "amino_acid1": "T", "amino_acid2": "G"}, "(260, 314)": {"freq": 2, "color": "#04BA1640", "amino_acid1": "S", "amino_acid2": "S"}, "(143, 193)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "F"}, "(70, 253)": {"freq": 1, "color": "#529B5233", "amino_acid1": "H", "amino_acid2": "T"}, "(265, 323)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "A", "amino_acid2": "K"}, "(114, 165)": {"freq": 1, "color": "#95D92133", "amino_acid1": "M", "amino_acid2": "H"}, "(177, 243)": {"freq": 1, "color": "#A593A433", "amino_acid1": "I", "amino_acid2": "F"}, "(124, 147)": {"freq": 1, "color": "#6910A233", "amino_acid1": "G", "amino_acid2": "L"}, "(345, 356)": {"freq": 1, "color": "#FE159C33", "amino_acid1": "M", "amino_acid2": "D"}, "(203, 398)": {"freq": 1, "color": "#E1319E33", "amino_acid1": "S", "amino_acid2": "Q"}, "(163, 243)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "I", "amino_acid2": "F"}, "(118, 147)": {"freq": 1, "color": "#6910A233", "amino_acid1": "I", "amino_acid2": "L"}, "(332, 357)": {"freq": 1, "color": "#A8635A33", "amino_acid1": "F", "amino_acid2": "V"}, "(201, 242)": {"freq": 1, "color": "#0A0D3C33", "amino_acid1": "T", "amino_acid2": "S"}, "(213, 340)": {"freq": 1, "color": "#A8BEA733", "amino_acid1": "F", "amino_acid2": "F"}, "(90, 106)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "A", "amino_acid2": "Q"}, "(149, 369)": {"freq": 1, "color": "#C0EDB333", "amino_acid1": "A", "amino_acid2": "G"}, "(94, 96)": {"freq": 1, "color": "#82817C33", "amino_acid1": "L", "amino_acid2": "I"}, "(376, 377)": {"freq": 1, "color": "#57C61F33", "amino_acid1": "N", "amino_acid2": "P"}, "(357, 358)": {"freq": 1, "color": "#A8635A33", "amino_acid1": "V", "amino_acid2": "I"}, "(121, 329)": {"freq": 1, "color": "#FF000033", "amino_acid1": "M", "amino_acid2": "F"}, "(180, 185)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "P", "amino_acid2": "R"}, "(90, 144)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "A", "amino_acid2": "P"}, "(132, 193)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "M", "amino_acid2": "F"}, "(333, 342)": {"freq": 1, "color": "#FB127033", "amino_acid1": "V", "amino_acid2": "T"}, "(93, 94)": {"freq": 1, "color": "#FF000033", "amino_acid1": "I", "amino_acid2": "L"}, "(391, 399)": {"freq": 1, "color": "#98906A33", "amino_acid1": "F", "amino_acid2": "Y"}, "(213, 342)": {"freq": 1, "color": "#A8BEA733", "amino_acid1": "F", "amino_acid2": "T"}, "(142, 152)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "I"}, "(119, 190)": {"freq": 1, "color": "#95D92133", "amino_acid1": "A", "amino_acid2": "T"}, "(85, 88)": {"freq": 1, "color": "#649AF533", "amino_acid1": "I", "amino_acid2": "T"}, "(115, 116)": {"freq": 1, "color": "#95D92133", "amino_acid1": "S", "amino_acid2": "L"}, "(178, 185)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "Q", "amino_acid2": "R"}, "(71, 163)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "I"}, "(197, 239)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "I", "amino_acid2": "S"}, "(179, 241)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "N", "amino_acid2": "V"}, "(106, 374)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "Q", "amino_acid2": "A"}, "(275, 352)": {"freq": 1, "color": "#2B503B33", "amino_acid1": "R", "amino_acid2": "S"}, "(268, 322)": {"freq": 1, "color": "#45E50F33", "amino_acid1": "C", "amino_acid2": "C"}, "(198, 346)": {"freq": 1, "color": "#A5331F33", "amino_acid1": "A", "amino_acid2": "A"}, "(179, 202)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "N", "amino_acid2": "I"}, "(142, 163)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "I"}, "(334, 370)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "V", "amino_acid2": "Y"}, "(322, 328)": {"freq": 1, "color": "#45E50F33", "amino_acid1": "C", "amino_acid2": "V"}, "(88, 96)": {"freq": 1, "color": "#649AF533", "amino_acid1": "T", "amino_acid2": "I"}, "(200, 396)": {"freq": 1, "color": "#39726133", "amino_acid1": "W", "amino_acid2": "Q"}, "(238, 268)": {"freq": 1, "color": "#0A0D3C33", "amino_acid1": "G", "amino_acid2": "C"}, "(141, 189)": {"freq": 1, "color": "#28D91033", "amino_acid1": "W", "amino_acid2": "R"}, "(260, 318)": {"freq": 1, "color": "#04BA1633", "amino_acid1": "S", "amino_acid2": "E"}, "(163, 239)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "I", "amino_acid2": "S"}, "(313, 357)": {"freq": 1, "color": "#04BA1633", "amino_acid1": "Q", "amino_acid2": "V"}, "(150, 160)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "V", "amino_acid2": "T"}, "(365, 374)": {"freq": 1, "color": "#A8635A33", "amino_acid1": "F", "amino_acid2": "A"}, "(178, 187)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "Q", "amino_acid2": "N"}, "(267, 275)": {"freq": 1, "color": "#2B503B33", "amino_acid1": "L", "amino_acid2": "R"}, "(143, 372)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "S"}, "(200, 365)": {"freq": 1, "color": "#39726133", "amino_acid1": "W", "amino_acid2": "F"}, "(200, 202)": {"freq": 1, "color": "#39726133", "amino_acid1": "W", "amino_acid2": "I"}, "(102, 180)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "E", "amino_acid2": "P"}, "(125, 345)": {"freq": 1, "color": "#FE159C33", "amino_acid1": "F", "amino_acid2": "M"}, "(207, 238)": {"freq": 1, "color": "#E1319E33", "amino_acid1": "S", "amino_acid2": "G"}, "(190, 365)": {"freq": 1, "color": "#95D92133", "amino_acid1": "T", "amino_acid2": "F"}, "(113, 163)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "L", "amino_acid2": "I"}, "(81, 222)": {"freq": 1, "color": "#5D927733", "amino_acid1": "T", "amino_acid2": "F"}, "(214, 215)": {"freq": 1, "color": "#833BCA33", "amino_acid1": "G", "amino_acid2": "L"}, "(333, 370)": {"freq": 1, "color": "#FB127033", "amino_acid1": "V", "amino_acid2": "Y"}, "(189, 253)": {"freq": 1, "color": "#28D91033", "amino_acid1": "R", "amino_acid2": "T"}, "(134, 371)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "T", "amino_acid2": "L"}, "(196, 332)": {"freq": 1, "color": "#A8635A33", "amino_acid1": "I", "amino_acid2": "F"}, "(123, 147)": {"freq": 1, "color": "#6910A233", "amino_acid1": "L", "amino_acid2": "L"}, "(97, 158)": {"freq": 1, "color": "#6EFF3A33", "amino_acid1": "M", "amino_acid2": "F"}, "(329, 330)": {"freq": 1, "color": "#FF000033", "amino_acid1": "F", "amino_acid2": "F"}, "(142, 184)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "S"}, "(137, 188)": {"freq": 1, "color": "#1D97F333", "amino_acid1": "Y", "amino_acid2": "S"}, "(216, 229)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "Q", "amino_acid2": "L"}, "(92, 101)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "N", "amino_acid2": "L"}, "(240, 265)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "F", "amino_acid2": "A"}, "(160, 329)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "T", "amino_acid2": "F"}, "(183, 219)": {"freq": 1, "color": "#AD840233", "amino_acid1": "H", "amino_acid2": "S"}, "(142, 371)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "L"}, "(118, 249)": {"freq": 1, "color": "#6910A233", "amino_acid1": "I", "amino_acid2": "I"}, "(132, 190)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "M", "amino_acid2": "T"}, "(196, 201)": {"freq": 1, "color": "#A8635A33", "amino_acid1": "I", "amino_acid2": "T"}, "(171, 243)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "F"}, "(193, 201)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "F", "amino_acid2": "T"}, "(70, 372)": {"freq": 1, "color": "#529B5233", "amino_acid1": "H", "amino_acid2": "S"}, "(141, 179)": {"freq": 1, "color": "#28D91033", "amino_acid1": "W", "amino_acid2": "N"}, "(85, 144)": {"freq": 1, "color": "#649AF533", "amino_acid1": "I", "amino_acid2": "P"}, "(183, 242)": {"freq": 1, "color": "#AD840233", "amino_acid1": "H", "amino_acid2": "S"}, "(71, 251)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "V"}, "(140, 193)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "R", "amino_acid2": "F"}, "(251, 258)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "V", "amino_acid2": "I"}, "(352, 356)": {"freq": 1, "color": "#2B503B33", "amino_acid1": "S", "amino_acid2": "D"}, "(118, 329)": {"freq": 1, "color": "#6910A233", "amino_acid1": "I", "amino_acid2": "F"}, "(336, 355)": {"freq": 1, "color": "#2CACC633", "amino_acid1": "W", "amino_acid2": "E"}, "(159, 213)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "S", "amino_acid2": "F"}, "(113, 166)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "L", "amino_acid2": "L"}, "(143, 369)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "G"}, "(197, 202)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "I", "amino_acid2": "I"}, "(216, 266)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "Q", "amino_acid2": "T"}, "(150, 179)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "V", "amino_acid2": "N"}, "(393, 399)": {"freq": 1, "color": "#98906A33", "amino_acid1": "R", "amino_acid2": "Y"}, "(95, 119)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "V", "amino_acid2": "A"}, "(179, 240)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "N", "amino_acid2": "F"}, "(116, 193)": {"freq": 1, "color": "#95D92133", "amino_acid1": "L", "amino_acid2": "F"}, "(92, 398)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "N", "amino_acid2": "Q"}, "(145, 150)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "S", "amino_acid2": "V"}, "(336, 337)": {"freq": 1, "color": "#2CACC633", "amino_acid1": "W", "amino_acid2": "C"}, "(142, 189)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "R"}, "(207, 394)": {"freq": 1, "color": "#E1319E33", "amino_acid1": "S", "amino_acid2": "Y"}, "(184, 338)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "S", "amino_acid2": "P"}, "(86, 95)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "I", "amino_acid2": "V"}, "(355, 358)": {"freq": 1, "color": "#2CACC633", "amino_acid1": "E", "amino_acid2": "I"}, "(102, 167)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "E", "amino_acid2": "C"}, "(144, 193)": {"freq": 1, "color": "#649AF533", "amino_acid1": "P", "amino_acid2": "F"}, "(181, 184)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "I", "amino_acid2": "S"}, "(142, 175)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "V"}, "(313, 316)": {"freq": 1, "color": "#04BA1633", "amino_acid1": "Q", "amino_acid2": "S"}, "(190, 368)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "T", "amino_acid2": "I"}, "(144, 163)": {"freq": 1, "color": "#649AF533", "amino_acid1": "P", "amino_acid2": "I"}, "(265, 333)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "A", "amino_acid2": "V"}, "(358, 365)": {"freq": 1, "color": "#2CACC633", "amino_acid1": "I", "amino_acid2": "F"}, "(130, 226)": {"freq": 1, "color": "#DD2EC833", "amino_acid1": "V", "amino_acid2": "S"}, "(92, 119)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "N", "amino_acid2": "A"}, "(376, 380)": {"freq": 1, "color": "#57C61F33", "amino_acid1": "N", "amino_acid2": "Y"}, "(334, 369)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "V", "amino_acid2": "G"}, "(199, 398)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "V", "amino_acid2": "Q"}, "(123, 148)": {"freq": 1, "color": "#6910A233", "amino_acid1": "L", "amino_acid2": "C"}, "(233, 259)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "N", "amino_acid2": "K"}, "(180, 184)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "P", "amino_acid2": "S"}, "(175, 243)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "V", "amino_acid2": "F"}, "(142, 153)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "Y"}, "(93, 330)": {"freq": 1, "color": "#FF000033", "amino_acid1": "I", "amino_acid2": "F"}, "(142, 193)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "F"}, "(360, 363)": {"freq": 1, "color": "#0598B133", "amino_acid1": "A", "amino_acid2": "N"}, "(196, 398)": {"freq": 1, "color": "#A8635A33", "amino_acid1": "I", "amino_acid2": "Q"}, "(148, 168)": {"freq": 1, "color": "#6910A233", "amino_acid1": "C", "amino_acid2": "A"}, "(126, 372)": {"freq": 1, "color": "#529B5233", "amino_acid1": "L", "amino_acid2": "S"}, "(101, 326)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "L", "amino_acid2": "G"}, "(184, 386)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "S", "amino_acid2": "T"}, "(137, 190)": {"freq": 1, "color": "#1D97F333", "amino_acid1": "Y", "amino_acid2": "T"}, "(144, 221)": {"freq": 1, "color": "#649AF533", "amino_acid1": "P", "amino_acid2": "V"}, "(221, 224)": {"freq": 1, "color": "#649AF533", "amino_acid1": "V", "amino_acid2": "E"}, "(193, 255)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "F", "amino_acid2": "F"}, "(216, 227)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "Q", "amino_acid2": "C"}, "(78, 90)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "A", "amino_acid2": "A"}, "(143, 383)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "F"}, "(143, 373)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "S"}, "(157, 330)": {"freq": 1, "color": "#FF000033", "amino_acid1": "L", "amino_acid2": "F"}, "(96, 346)": {"freq": 1, "color": "#649AF533", "amino_acid1": "I", "amino_acid2": "A"}, "(267, 314)": {"freq": 1, "color": "#2B503B33", "amino_acid1": "L", "amino_acid2": "S"}, "(169, 249)": {"freq": 1, "color": "#6910A233", "amino_acid1": "I", "amino_acid2": "I"}, "(132, 370)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "M", "amino_acid2": "Y"}, "(84, 144)": {"freq": 1, "color": "#649AF533", "amino_acid1": "V", "amino_acid2": "P"}, "(143, 161)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "L", "amino_acid2": "A"}, "(90, 111)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "A", "amino_acid2": "Y"}, "(161, 352)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "A", "amino_acid2": "S"}, "(90, 373)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "A", "amino_acid2": "S"}, "(193, 205)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "F", "amino_acid2": "G"}, "(117, 159)": {"freq": 1, "color": "#FF000033", "amino_acid1": "A", "amino_acid2": "S"}, "(193, 346)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "F", "amino_acid2": "A"}, "(152, 369)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "I", "amino_acid2": "G"}, "(214, 222)": {"freq": 1, "color": "#833BCA33", "amino_acid1": "G", "amino_acid2": "F"}, "(122, 148)": {"freq": 1, "color": "#6910A233", "amino_acid1": "L", "amino_acid2": "C"}, "(73, 90)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "E", "amino_acid2": "A"}, "(119, 193)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "A", "amino_acid2": "F"}, "(185, 188)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "R", "amino_acid2": "S"}, "(92, 329)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "N", "amino_acid2": "F"}, "(131, 144)": {"freq": 1, "color": "#649AF533", "amino_acid1": "S", "amino_acid2": "P"}, "(204, 338)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "V", "amino_acid2": "P"}, "(89, 90)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "I", "amino_acid2": "A"}, "(170, 247)": {"freq": 1, "color": "#DF8DA933", "amino_acid1": "S", "amino_acid2": "L"}, "(147, 216)": {"freq": 1, "color": "#6910A233", "amino_acid1": "L", "amino_acid2": "Q"}, "(119, 398)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "A", "amino_acid2": "Q"}, "(157, 393)": {"freq": 1, "color": "#FF000033", "amino_acid1": "L", "amino_acid2": "R"}, "(110, 328)": {"freq": 1, "color": "#45E50F33", "amino_acid1": "N", "amino_acid2": "V"}, "(184, 364)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "S", "amino_acid2": "V"}, "(236, 267)": {"freq": 1, "color": "#2B503B33", "amino_acid1": "L", "amino_acid2": "L"}, "(179, 365)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "N", "amino_acid2": "F"}, "(89, 144)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "I", "amino_acid2": "P"}, "(116, 397)": {"freq": 1, "color": "#95D92133", "amino_acid1": "L", "amino_acid2": "C"}, "(191, 389)": {"freq": 1, "color": "#E856BA33", "amino_acid1": "K", "amino_acid2": "S"}, "(336, 346)": {"freq": 1, "color": "#2CACC633", "amino_acid1": "W", "amino_acid2": "A"}, "(190, 360)": {"freq": 1, "color": "#1D97F333", "amino_acid1": "T", "amino_acid2": "A"}, "(214, 223)": {"freq": 1, "color": "#833BCA33", "amino_acid1": "G", "amino_acid2": "K"}, "(192, 317)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "A", "amino_acid2": "N"}, "(197, 398)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "I", "amino_acid2": "Q"}, "(193, 257)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "F", "amino_acid2": "T"}, "(164, 244)": {"freq": 1, "color": "#95D92133", "amino_acid1": "W", "amino_acid2": "F"}, "(126, 145)": {"freq": 1, "color": "#529B5233", "amino_acid1": "L", "amino_acid2": "S"}, "(72, 121)": {"freq": 1, "color": "#FF000033", "amino_acid1": "Q", "amino_acid2": "M"}, "(206, 398)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "I", "amino_acid2": "Q"}, "(77, 175)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "S", "amino_acid2": "V"}, "(182, 199)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "H", "amino_acid2": "V"}, "(237, 268)": {"freq": 1, "color": "#0A0D3C33", "amino_acid1": "I", "amino_acid2": "C"}, "(90, 95)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "A", "amino_acid2": "V"}, "(146, 206)": {"freq": 1, "color": "#6BF79533", "amino_acid1": "K", "amino_acid2": "I"}, "(98, 143)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "A", "amino_acid2": "L"}, "(177, 367)": {"freq": 1, "color": "#A593A433", "amino_acid1": "I", "amino_acid2": "W"}, "(82, 146)": {"freq": 1, "color": "#5D927733", "amino_acid1": "A", "amino_acid2": "K"}, "(242, 332)": {"freq": 1, "color": "#AD840233", "amino_acid1": "S", "amino_acid2": "F"}, "(227, 378)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "C", "amino_acid2": "L"}, "(159, 208)": {"freq": 1, "color": "#FF000033", "amino_acid1": "S", "amino_acid2": "M"}, "(169, 189)": {"freq": 1, "color": "#6910A233", "amino_acid1": "I", "amino_acid2": "R"}, "(159, 376)": {"freq": 1, "color": "#FF000033", "amino_acid1": "S", "amino_acid2": "N"}, "(151, 372)": {"freq": 1, "color": "#529B5233", "amino_acid1": "W", "amino_acid2": "S"}, "(129, 189)": {"freq": 1, "color": "#6910A233", "amino_acid1": "P", "amino_acid2": "R"}, "(150, 197)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "V", "amino_acid2": "I"}, "(200, 242)": {"freq": 1, "color": "#39726133", "amino_acid1": "W", "amino_acid2": "S"}, "(143, 177)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "L", "amino_acid2": "I"}, "(143, 162)": {"freq": 1, "color": "#2A7E2A33", "amino_acid1": "L", "amino_acid2": "K"}, "(77, 183)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "S", "amino_acid2": "H"}, "(263, 352)": {"freq": 1, "color": "#6624AC33", "amino_acid1": "K", "amino_acid2": "S"}, "(121, 190)": {"freq": 1, "color": "#FF000033", "amino_acid1": "M", "amino_acid2": "T"}, "(350, 396)": {"freq": 1, "color": "#2CACC633", "amino_acid1": "K", "amino_acid2": "Q"}, "(90, 143)": {"freq": 1, "color": "#9F63D333", "amino_acid1": "A", "amino_acid2": "L"}, "(123, 193)": {"freq": 1, "color": "#6910A233", "amino_acid1": "L", "amino_acid2": "F"}, "(80, 184)": {"freq": 1, "color": "#293E8A33", "amino_acid1": "L", "amino_acid2": "S"}, "(136, 212)": {"freq": 1, "color": "#D3FC2033", "amino_acid1": "L", "amino_acid2": "V"}, "(142, 179)": {"freq": 1, "color": "#7EE75733", "amino_acid1": "P", "amino_acid2": "N"}, "(129, 370)": {"freq": 1, "color": "#6910A233", "amino_acid1": "P", "amino_acid2": "Y"}};
    var listItems = document.querySelectorAll('#myDropdown_mrmr_ca_10 a');
    listItems.forEach(function (item) {
      toggleHighlight(item);
  
    });
  }
  else if (typeFS == "ca_mrmr_1" ) {
    pair_dict = {"(93, 329)": {"freq": 16, "color": "#FF0000FF", "amino_acid1": "I", "amino_acid2": "F"}, "(179, 336)": {"freq": 3, "color": "#0000FF4E", "amino_acid1": "N", "amino_acid2": "W"}, "(92, 98)": {"freq": 2, "color": "#2A7E2A40", "amino_acid1": "N", "amino_acid2": "A"}, "(117, 329)": {"freq": 2, "color": "#FF000040", "amino_acid1": "A", "amino_acid2": "F"}, "(143, 163)": {"freq": 2, "color": "#9E94BE40", "amino_acid1": "L", "amino_acid2": "I"}, "(326, 328)": {"freq": 2, "color": "#2CACC640", "amino_acid1": "G", "amino_acid2": "V"}, "(179, 184)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "N", "amino_acid2": "S"}, "(159, 216)": {"freq": 1, "color": "#F28F2D33", "amino_acid1": "S", "amino_acid2": "Q"}, "(326, 330)": {"freq": 1, "color": "#2CACC633", "amino_acid1": "G", "amino_acid2": "F"}, "(143, 370)": {"freq": 1, "color": "#9E94BE33", "amino_acid1": "L", "amino_acid2": "Y"}, "(190, 365)": {"freq": 1, "color": "#CAF54F33", "amino_acid1": "T", "amino_acid2": "F"}, "(240, 265)": {"freq": 1, "color": "#7F5B7E33", "amino_acid1": "F", "amino_acid2": "A"}, "(336, 355)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "W", "amino_acid2": "E"}, "(190, 368)": {"freq": 1, "color": "#CAF54F33", "amino_acid1": "T", "amino_acid2": "I"}, "(143, 373)": {"freq": 1, "color": "#9E94BE33", "amino_acid1": "L", "amino_acid2": "S"}, "(81, 82)": {"freq": 1, "color": "#789B3433", "amino_acid1": "T", "amino_acid2": "A"}, "(204, 338)": {"freq": 1, "color": "#99039533", "amino_acid1": "V", "amino_acid2": "P"}, "(336, 350)": {"freq": 1, "color": "#0000FF33", "amino_acid1": "W", "amino_acid2": "K"}, "(143, 162)": {"freq": 1, "color": "#9E94BE33", "amino_acid1": "L", "amino_acid2": "K"}};
    var listItems = document.querySelectorAll('#myDropdown_mrmr_ca_1 a');
    listItems.forEach(function (item) {
      toggleHighlight(item);
  
    });
  } else if (typeFS == "min_mrmr_10" ) {
  var pair_dict = {"(197, 336)": {"freq": 17, "color": "#0000FFFF", "amino_acid1": "I", "amino_acid2": "W"}, "(198, 200)": {"freq": 13, "color": "#FF0000D2", "amino_acid1": "A", "amino_acid2": "W"}, "(179, 332)": {"freq": 9, "color": "#2A7E2AA5", "amino_acid1": "N", "amino_acid2": "F"}, "(178, 184)": {"freq": 6, "color": "#909EB384", "amino_acid1": "Q", "amino_acid2": "S"}, "(153, 159)": {"freq": 6, "color": "#6A3F1884", "amino_acid1": "Y", "amino_acid2": "S"}, "(143, 163)": {"freq": 6, "color": "#98361284", "amino_acid1": "L", "amino_acid2": "I"}, "(251, 252)": {"freq": 6, "color": "#187C0584", "amino_acid1": "V", "amino_acid2": "I"}, "(143, 371)": {"freq": 5, "color": "#98361279", "amino_acid1": "L", "amino_acid2": "L"}, "(356, 357)": {"freq": 5, "color": "#2AC13079", "amino_acid1": "D", "amino_acid2": "V"}, "(179, 336)": {"freq": 5, "color": "#2A7E2A79", "amino_acid1": "N", "amino_acid2": "W"}, "(201, 336)": {"freq": 5, "color": "#2A7E2A79", "amino_acid1": "T", "amino_acid2": "W"}, "(362, 363)": {"freq": 4, "color": "#0C72F36D", "amino_acid1": "L", "amino_acid2": "N"}, "(204, 238)": {"freq": 4, "color": "#37DA576D", "amino_acid1": "V", "amino_acid2": "G"}, "(263, 264)": {"freq": 4, "color": "#EC27666D", "amino_acid1": "K", "amino_acid2": "E"}, "(203, 336)": {"freq": 4, "color": "#2A7E2A6D", "amino_acid1": "S", "amino_acid2": "W"}, "(325, 326)": {"freq": 4, "color": "#4459A96D", "amino_acid1": "L", "amino_acid2": "G"}, "(161, 336)": {"freq": 3, "color": "#2A7E2A62", "amino_acid1": "A", "amino_acid2": "W"}, "(140, 141)": {"freq": 3, "color": "#8EB22262", "amino_acid1": "R", "amino_acid2": "W"}, "(116, 330)": {"freq": 3, "color": "#70E57662", "amino_acid1": "L", "amino_acid2": "F"}, "(201, 202)": {"freq": 3, "color": "#2A7E2A62", "amino_acid1": "T", "amino_acid2": "I"}, "(314, 315)": {"freq": 3, "color": "#00F23262", "amino_acid1": "S", "amino_acid2": "I"}, "(193, 391)": {"freq": 3, "color": "#DEE0BD62", "amino_acid1": "F", "amino_acid2": "F"}, "(193, 398)": {"freq": 3, "color": "#DEE0BD62", "amino_acid1": "F", "amino_acid2": "Q"}, "(141, 163)": {"freq": 3, "color": "#8EB22262", "amino_acid1": "W", "amino_acid2": "I"}, "(82, 83)": {"freq": 2, "color": "#F7EA4957", "amino_acid1": "A", "amino_acid2": "V"}, "(189, 192)": {"freq": 2, "color": "#EA929057", "amino_acid1": "R", "amino_acid2": "A"}, "(88, 143)": {"freq": 2, "color": "#98361257", "amino_acid1": "T", "amino_acid2": "L"}, "(151, 152)": {"freq": 2, "color": "#3DE72F57", "amino_acid1": "W", "amino_acid2": "I"}, "(77, 334)": {"freq": 2, "color": "#3897BE57", "amino_acid1": "S", "amino_acid2": "V"}, "(169, 170)": {"freq": 2, "color": "#1D6FFA57", "amino_acid1": "I", "amino_acid2": "S"}, "(137, 140)": {"freq": 2, "color": "#8EB22257", "amino_acid1": "Y", "amino_acid2": "R"}, "(373, 376)": {"freq": 2, "color": "#7EA95557", "amino_acid1": "S", "amino_acid2": "N"}, "(138, 385)": {"freq": 2, "color": "#365DBF57", "amino_acid1": "G", "amino_acid2": "K"}, "(179, 184)": {"freq": 2, "color": "#2A7E2A57", "amino_acid1": "N", "amino_acid2": "S"}, "(143, 381)": {"freq": 2, "color": "#98361257", "amino_acid1": "L", "amino_acid2": "T"}, "(143, 193)": {"freq": 2, "color": "#98361257", "amino_acid1": "L", "amino_acid2": "F"}, "(357, 363)": {"freq": 2, "color": "#2AC13057", "amino_acid1": "V", "amino_acid2": "N"}, "(159, 397)": {"freq": 2, "color": "#6A3F1857", "amino_acid1": "S", "amino_acid2": "C"}, "(159, 391)": {"freq": 2, "color": "#6A3F1857", "amino_acid1": "S", "amino_acid2": "F"}, "(201, 398)": {"freq": 2, "color": "#2A7E2A57", "amino_acid1": "T", "amino_acid2": "Q"}, "(189, 336)": {"freq": 2, "color": "#EA929057", "amino_acid1": "R", "amino_acid2": "W"}, "(92, 329)": {"freq": 2, "color": "#52F3D057", "amino_acid1": "N", "amino_acid2": "F"}, "(160, 216)": {"freq": 2, "color": "#C9533E57", "amino_acid1": "T", "amino_acid2": "Q"}, "(142, 381)": {"freq": 2, "color": "#98361257", "amino_acid1": "P", "amino_acid2": "T"}, "(148, 154)": {"freq": 2, "color": "#427A9D57", "amino_acid1": "C", "amino_acid2": "L"}, "(77, 243)": {"freq": 2, "color": "#3897BE57", "amino_acid1": "S", "amino_acid2": "F"}, "(376, 382)": {"freq": 2, "color": "#7EA95557", "amino_acid1": "N", "amino_acid2": "L"}, "(170, 339)": {"freq": 1, "color": "#1D6FFA4C", "amino_acid1": "S", "amino_acid2": "F"}, "(132, 184)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "M", "amino_acid2": "S"}, "(180, 265)": {"freq": 1, "color": "#9D8FCF4C", "amino_acid1": "P", "amino_acid2": "A"}, "(172, 327)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "D", "amino_acid2": "I"}, "(115, 116)": {"freq": 1, "color": "#70E5764C", "amino_acid1": "S", "amino_acid2": "L"}, "(135, 378)": {"freq": 1, "color": "#F56C344C", "amino_acid1": "I", "amino_acid2": "L"}, "(53, 133)": {"freq": 1, "color": "#919C944C", "amino_acid1": "T", "amino_acid2": "L"}, "(105, 140)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "L", "amino_acid2": "R"}, "(157, 265)": {"freq": 1, "color": "#9D8FCF4C", "amino_acid1": "L", "amino_acid2": "A"}, "(140, 192)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "R", "amino_acid2": "A"}, "(171, 189)": {"freq": 1, "color": "#EA92904C", "amino_acid1": "L", "amino_acid2": "R"}, "(142, 149)": {"freq": 1, "color": "#9836124C", "amino_acid1": "P", "amino_acid2": "A"}, "(184, 336)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "S", "amino_acid2": "W"}, "(168, 247)": {"freq": 1, "color": "#C803B64C", "amino_acid1": "A", "amino_acid2": "L"}, "(160, 205)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "T", "amino_acid2": "G"}, "(156, 353)": {"freq": 1, "color": "#7131914C", "amino_acid1": "V", "amino_acid2": "C"}, "(186, 371)": {"freq": 1, "color": "#9836124C", "amino_acid1": "F", "amino_acid2": "L"}, "(156, 246)": {"freq": 1, "color": "#7131914C", "amino_acid1": "V", "amino_acid2": "P"}, "(206, 337)": {"freq": 1, "color": "#CF13414C", "amino_acid1": "I", "amino_acid2": "C"}, "(143, 174)": {"freq": 1, "color": "#9836124C", "amino_acid1": "L", "amino_acid2": "Y"}, "(160, 398)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "T", "amino_acid2": "Q"}, "(99, 368)": {"freq": 1, "color": "#7237894C", "amino_acid1": "V", "amino_acid2": "I"}, "(96, 193)": {"freq": 1, "color": "#9836124C", "amino_acid1": "I", "amino_acid2": "F"}, "(196, 238)": {"freq": 1, "color": "#37DA574C", "amino_acid1": "I", "amino_acid2": "G"}, "(216, 368)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "Q", "amino_acid2": "I"}, "(172, 325)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "D", "amino_acid2": "L"}, "(193, 389)": {"freq": 1, "color": "#9836124C", "amino_acid1": "F", "amino_acid2": "S"}, "(255, 325)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "F", "amino_acid2": "L"}, "(387, 398)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "Y", "amino_acid2": "Q"}, "(190, 377)": {"freq": 1, "color": "#3C1DDB4C", "amino_acid1": "T", "amino_acid2": "P"}, "(254, 364)": {"freq": 1, "color": "#0B721B4C", "amino_acid1": "Y", "amino_acid2": "V"}, "(177, 179)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "I", "amino_acid2": "N"}, "(90, 95)": {"freq": 1, "color": "#CC96CA4C", "amino_acid1": "A", "amino_acid2": "V"}, "(118, 160)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "I", "amino_acid2": "T"}, "(191, 377)": {"freq": 1, "color": "#3C1DDB4C", "amino_acid1": "K", "amino_acid2": "P"}, "(211, 268)": {"freq": 1, "color": "#A6FE4F4C", "amino_acid1": "P", "amino_acid2": "C"}, "(325, 347)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "L", "amino_acid2": "V"}, "(357, 362)": {"freq": 1, "color": "#2AC1304C", "amino_acid1": "V", "amino_acid2": "L"}, "(144, 386)": {"freq": 1, "color": "#4D21CB4C", "amino_acid1": "P", "amino_acid2": "T"}, "(137, 152)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "Y", "amino_acid2": "I"}, "(183, 185)": {"freq": 1, "color": "#0651F74C", "amino_acid1": "H", "amino_acid2": "R"}, "(206, 212)": {"freq": 1, "color": "#CF13414C", "amino_acid1": "I", "amino_acid2": "V"}, "(141, 183)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "W", "amino_acid2": "H"}, "(267, 313)": {"freq": 1, "color": "#D55D314C", "amino_acid1": "L", "amino_acid2": "Q"}, "(175, 332)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "V", "amino_acid2": "F"}, "(142, 184)": {"freq": 1, "color": "#9836124C", "amino_acid1": "P", "amino_acid2": "S"}, "(124, 190)": {"freq": 1, "color": "#3C1DDB4C", "amino_acid1": "G", "amino_acid2": "T"}, "(157, 228)": {"freq": 1, "color": "#9D8FCF4C", "amino_acid1": "L", "amino_acid2": "L"}, "(159, 398)": {"freq": 1, "color": "#6A3F184C", "amino_acid1": "S", "amino_acid2": "Q"}, "(331, 332)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "L", "amino_acid2": "F"}, "(101, 163)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "L", "amino_acid2": "I"}, "(187, 340)": {"freq": 1, "color": "#E1A6634C", "amino_acid1": "N", "amino_acid2": "F"}, "(254, 336)": {"freq": 1, "color": "#0B721B4C", "amino_acid1": "Y", "amino_acid2": "W"}, "(89, 373)": {"freq": 1, "color": "#7EA9554C", "amino_acid1": "I", "amino_acid2": "S"}, "(77, 369)": {"freq": 1, "color": "#3897BE4C", "amino_acid1": "S", "amino_acid2": "G"}, "(99, 394)": {"freq": 1, "color": "#7237894C", "amino_acid1": "V", "amino_acid2": "Y"}, "(160, 211)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "T", "amino_acid2": "P"}, "(130, 144)": {"freq": 1, "color": "#4D21CB4C", "amino_acid1": "V", "amino_acid2": "P"}, "(100, 159)": {"freq": 1, "color": "#6A3F184C", "amino_acid1": "S", "amino_acid2": "S"}, "(156, 361)": {"freq": 1, "color": "#7131914C", "amino_acid1": "V", "amino_acid2": "L"}, "(197, 242)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "I", "amino_acid2": "S"}, "(184, 189)": {"freq": 1, "color": "#9836124C", "amino_acid1": "S", "amino_acid2": "R"}, "(246, 253)": {"freq": 1, "color": "#7131914C", "amino_acid1": "P", "amino_acid2": "T"}, "(70, 372)": {"freq": 1, "color": "#97ECF64C", "amino_acid1": "H", "amino_acid2": "S"}, "(87, 183)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "L", "amino_acid2": "H"}, "(346, 351)": {"freq": 1, "color": "#C56E444C", "amino_acid1": "A", "amino_acid2": "E"}, "(213, 265)": {"freq": 1, "color": "#9D8FCF4C", "amino_acid1": "F", "amino_acid2": "A"}, "(160, 204)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "T", "amino_acid2": "V"}, "(128, 142)": {"freq": 1, "color": "#9836124C", "amino_acid1": "M", "amino_acid2": "P"}, "(91, 95)": {"freq": 1, "color": "#CC96CA4C", "amino_acid1": "G", "amino_acid2": "V"}, "(222, 224)": {"freq": 1, "color": "#5867254C", "amino_acid1": "F", "amino_acid2": "E"}, "(313, 336)": {"freq": 1, "color": "#D55D314C", "amino_acid1": "Q", "amino_acid2": "W"}, "(154, 193)": {"freq": 1, "color": "#427A9D4C", "amino_acid1": "L", "amino_acid2": "F"}, "(79, 388)": {"freq": 1, "color": "#EDC8694C", "amino_acid1": "L", "amino_acid2": "R"}, "(72, 89)": {"freq": 1, "color": "#7EA9554C", "amino_acid1": "Q", "amino_acid2": "I"}, "(206, 244)": {"freq": 1, "color": "#CF13414C", "amino_acid1": "I", "amino_acid2": "F"}, "(94, 117)": {"freq": 1, "color": "#322C124C", "amino_acid1": "L", "amino_acid2": "A"}, "(179, 183)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "N", "amino_acid2": "H"}, "(193, 226)": {"freq": 1, "color": "#427A9D4C", "amino_acid1": "F", "amino_acid2": "S"}, "(146, 215)": {"freq": 1, "color": "#87D3D74C", "amino_acid1": "K", "amino_acid2": "L"}, "(267, 317)": {"freq": 1, "color": "#D55D314C", "amino_acid1": "L", "amino_acid2": "N"}, "(196, 244)": {"freq": 1, "color": "#37DA574C", "amino_acid1": "I", "amino_acid2": "F"}, "(143, 382)": {"freq": 1, "color": "#9836124C", "amino_acid1": "L", "amino_acid2": "L"}, "(179, 357)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "N", "amino_acid2": "V"}, "(143, 399)": {"freq": 1, "color": "#9836124C", "amino_acid1": "L", "amino_acid2": "Y"}, "(372, 374)": {"freq": 1, "color": "#97ECF64C", "amino_acid1": "S", "amino_acid2": "A"}, "(179, 321)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "N", "amino_acid2": "A"}, "(116, 159)": {"freq": 1, "color": "#70E5764C", "amino_acid1": "L", "amino_acid2": "S"}, "(184, 226)": {"freq": 1, "color": "#9836124C", "amino_acid1": "S", "amino_acid2": "S"}, "(251, 268)": {"freq": 1, "color": "#187C054C", "amino_acid1": "V", "amino_acid2": "C"}, "(80, 81)": {"freq": 1, "color": "#80E14E4C", "amino_acid1": "L", "amino_acid2": "T"}, "(165, 244)": {"freq": 1, "color": "#37DA574C", "amino_acid1": "H", "amino_acid2": "F"}, "(207, 393)": {"freq": 1, "color": "#0960384C", "amino_acid1": "S", "amino_acid2": "R"}, "(206, 209)": {"freq": 1, "color": "#CF13414C", "amino_acid1": "I", "amino_acid2": "P"}, "(151, 235)": {"freq": 1, "color": "#3DE72F4C", "amino_acid1": "W", "amino_acid2": "V"}, "(142, 174)": {"freq": 1, "color": "#9836124C", "amino_acid1": "P", "amino_acid2": "Y"}, "(233, 235)": {"freq": 1, "color": "#3DE72F4C", "amino_acid1": "N", "amino_acid2": "V"}, "(140, 193)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "R", "amino_acid2": "F"}, "(153, 192)": {"freq": 1, "color": "#6A3F184C", "amino_acid1": "Y", "amino_acid2": "A"}, "(141, 174)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "W", "amino_acid2": "Y"}, "(161, 183)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "A", "amino_acid2": "H"}, "(148, 188)": {"freq": 1, "color": "#427A9D4C", "amino_acid1": "C", "amino_acid2": "S"}, "(193, 242)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "F", "amino_acid2": "S"}, "(261, 265)": {"freq": 1, "color": "#9D8FCF4C", "amino_acid1": "L", "amino_acid2": "A"}, "(307, 360)": {"freq": 1, "color": "#7043644C", "amino_acid1": "T", "amino_acid2": "A"}, "(71, 344)": {"freq": 1, "color": "#3212D14C", "amino_acid1": "L", "amino_acid2": "I"}, "(335, 351)": {"freq": 1, "color": "#C56E444C", "amino_acid1": "M", "amino_acid2": "E"}, "(92, 155)": {"freq": 1, "color": "#52F3D04C", "amino_acid1": "N", "amino_acid2": "D"}, "(158, 197)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "F", "amino_acid2": "I"}, "(208, 398)": {"freq": 1, "color": "#6A3F184C", "amino_acid1": "M", "amino_acid2": "Q"}, "(140, 179)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "R", "amino_acid2": "N"}, "(138, 390)": {"freq": 1, "color": "#365DBF4C", "amino_acid1": "G", "amino_acid2": "A"}, "(130, 208)": {"freq": 1, "color": "#4D21CB4C", "amino_acid1": "V", "amino_acid2": "M"}, "(252, 258)": {"freq": 1, "color": "#187C054C", "amino_acid1": "I", "amino_acid2": "I"}, "(339, 341)": {"freq": 1, "color": "#1D6FFA4C", "amino_acid1": "F", "amino_acid2": "I"}, "(190, 197)": {"freq": 1, "color": "#3C1DDB4C", "amino_acid1": "T", "amino_acid2": "I"}, "(94, 138)": {"freq": 1, "color": "#322C124C", "amino_acid1": "L", "amino_acid2": "G"}, "(335, 360)": {"freq": 1, "color": "#C56E444C", "amino_acid1": "M", "amino_acid2": "A"}, "(324, 350)": {"freq": 1, "color": "#30FF2B4C", "amino_acid1": "V", "amino_acid2": "K"}, "(72, 97)": {"freq": 1, "color": "#7EA9554C", "amino_acid1": "Q", "amino_acid2": "M"}, "(193, 225)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "F", "amino_acid2": "G"}, "(107, 193)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "N", "amino_acid2": "F"}, "(149, 368)": {"freq": 1, "color": "#9836124C", "amino_acid1": "A", "amino_acid2": "I"}, "(246, 257)": {"freq": 1, "color": "#7131914C", "amino_acid1": "P", "amino_acid2": "T"}, "(125, 329)": {"freq": 1, "color": "#52F3D04C", "amino_acid1": "F", "amino_acid2": "F"}, "(143, 173)": {"freq": 1, "color": "#9836124C", "amino_acid1": "L", "amino_acid2": "R"}, "(193, 221)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "F", "amino_acid2": "V"}, "(113, 253)": {"freq": 1, "color": "#7131914C", "amino_acid1": "L", "amino_acid2": "T"}, "(184, 188)": {"freq": 1, "color": "#9836124C", "amino_acid1": "S", "amino_acid2": "S"}, "(92, 94)": {"freq": 1, "color": "#52F3D04C", "amino_acid1": "N", "amino_acid2": "L"}, "(136, 336)": {"freq": 1, "color": "#D55D314C", "amino_acid1": "L", "amino_acid2": "W"}, "(268, 344)": {"freq": 1, "color": "#187C054C", "amino_acid1": "C", "amino_acid2": "I"}, "(179, 192)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "N", "amino_acid2": "A"}, "(335, 350)": {"freq": 1, "color": "#C56E444C", "amino_acid1": "M", "amino_acid2": "K"}, "(336, 366)": {"freq": 1, "color": "#D55D314C", "amino_acid1": "W", "amino_acid2": "V"}, "(95, 98)": {"freq": 1, "color": "#CC96CA4C", "amino_acid1": "V", "amino_acid2": "A"}, "(123, 145)": {"freq": 1, "color": "#6BFB024C", "amino_acid1": "L", "amino_acid2": "S"}, "(93, 193)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "I", "amino_acid2": "F"}, "(117, 190)": {"freq": 1, "color": "#322C124C", "amino_acid1": "A", "amino_acid2": "T"}, "(94, 350)": {"freq": 1, "color": "#52F3D04C", "amino_acid1": "L", "amino_acid2": "K"}, "(142, 163)": {"freq": 1, "color": "#9836124C", "amino_acid1": "P", "amino_acid2": "I"}, "(116, 189)": {"freq": 1, "color": "#70E5764C", "amino_acid1": "L", "amino_acid2": "R"}, "(187, 216)": {"freq": 1, "color": "#E1A6634C", "amino_acid1": "N", "amino_acid2": "Q"}, "(149, 369)": {"freq": 1, "color": "#9836124C", "amino_acid1": "A", "amino_acid2": "G"}, "(153, 193)": {"freq": 1, "color": "#6A3F184C", "amino_acid1": "Y", "amino_acid2": "F"}, "(260, 315)": {"freq": 1, "color": "#00F2324C", "amino_acid1": "S", "amino_acid2": "I"}, "(190, 336)": {"freq": 1, "color": "#322C124C", "amino_acid1": "T", "amino_acid2": "W"}, "(243, 378)": {"freq": 1, "color": "#3897BE4C", "amino_acid1": "F", "amino_acid2": "L"}, "(72, 86)": {"freq": 1, "color": "#7EA9554C", "amino_acid1": "Q", "amino_acid2": "I"}, "(127, 179)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "V", "amino_acid2": "N"}, "(167, 247)": {"freq": 1, "color": "#C803B64C", "amino_acid1": "C", "amino_acid2": "L"}, "(210, 211)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "I", "amino_acid2": "P"}, "(233, 245)": {"freq": 1, "color": "#3DE72F4C", "amino_acid1": "N", "amino_acid2": "I"}, "(189, 387)": {"freq": 1, "color": "#70E5764C", "amino_acid1": "R", "amino_acid2": "Y"}, "(179, 228)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "N", "amino_acid2": "L"}, "(89, 91)": {"freq": 1, "color": "#7EA9554C", "amino_acid1": "I", "amino_acid2": "G"}, "(357, 365)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "V", "amino_acid2": "F"}, "(255, 265)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "F", "amino_acid2": "A"}, "(229, 230)": {"freq": 1, "color": "#693D3B4C", "amino_acid1": "L", "amino_acid2": "A"}, "(230, 261)": {"freq": 1, "color": "#693D3B4C", "amino_acid1": "A", "amino_acid2": "L"}, "(156, 358)": {"freq": 1, "color": "#7131914C", "amino_acid1": "V", "amino_acid2": "I"}, "(83, 380)": {"freq": 1, "color": "#F7EA494C", "amino_acid1": "V", "amino_acid2": "Y"}, "(172, 332)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "D", "amino_acid2": "F"}, "(346, 350)": {"freq": 1, "color": "#C56E444C", "amino_acid1": "A", "amino_acid2": "K"}, "(85, 373)": {"freq": 1, "color": "#7EA9554C", "amino_acid1": "I", "amino_acid2": "S"}, "(143, 215)": {"freq": 1, "color": "#9836124C", "amino_acid1": "L", "amino_acid2": "L"}, "(148, 374)": {"freq": 1, "color": "#427A9D4C", "amino_acid1": "C", "amino_acid2": "A"}, "(90, 103)": {"freq": 1, "color": "#CC96CA4C", "amino_acid1": "A", "amino_acid2": "K"}, "(260, 317)": {"freq": 1, "color": "#00F2324C",  "amino_acid1": "S", "amino_acid2": "N"}, "(179, 242)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "N", "amino_acid2": "S"}, "(74, 345)": {"freq": 1, "color": "#14B38F4C", "amino_acid1": "K", "amino_acid2": "M"}, "(141, 193)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "W", "amino_acid2": "F"}, "(138, 193)": {"freq": 1, "color": "#322C124C", "amino_acid1": "G", "amino_acid2": "F"}, "(95, 389)": {"freq": 1, "color": "#CC96CA4C", "amino_acid1": "V", "amino_acid2": "S"}, "(131, 144)": {"freq": 1, "color": "#4D21CB4C", "amino_acid1": "S", "amino_acid2": "P"}, "(183, 378)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "H", "amino_acid2": "L"}, "(315, 325)": {"freq": 1, "color": "#00F2324C", "amino_acid1": "I", "amino_acid2": "L"}, "(143, 372)": {"freq": 1, "color": "#9836124C", "amino_acid1": "L", "amino_acid2": "S"}, "(201, 342)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "T", "amino_acid2": "T"}, "(168, 243)": {"freq": 1, "color": "#C803B64C", "amino_acid1": "A", "amino_acid2": "F"}, "(98, 373)": {"freq": 1, "color": "#CC96CA4C", "amino_acid1": "A", "amino_acid2": "S"}, "(389, 399)": {"freq": 1, "color": "#CC96CA4C", "amino_acid1": "S", "amino_acid2": "Y"}, "(336, 355)": {"freq": 1, "color": "#322C124C", "amino_acid1": "W", "amino_acid2": "E"}, "(209, 337)": {"freq": 1, "color": "#CF13414C", "amino_acid1": "P", "amino_acid2": "C"}, "(137, 220)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "Y", "amino_acid2": "K"}, "(186, 337)": {"freq": 1, "color": "#9836124C", "amino_acid1": "F", "amino_acid2": "C"}, "(100, 398)": {"freq": 1, "color": "#6A3F184C", "amino_acid1": "S", "amino_acid2": "Q"}, "(77, 179)": {"freq": 1, "color": "#3897BE4C", "amino_acid1": "S", "amino_acid2": "N"}, "(72, 79)": {"freq": 1, "color": "#7EA9554C", "amino_acid1": "Q", "amino_acid2": "L"}, "(170, 321)": {"freq": 1, "color": "#1D6FFA4C", "amino_acid1": "S", "amino_acid2": "A"}, "(172, 344)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "D", "amino_acid2": "I"}, "(147, 157)": {"freq": 1, "color": "#9D8FCF4C", "amino_acid1": "L", "amino_acid2": "L"}, "(307, 314)": {"freq": 1, "color": "#7043644C", "amino_acid1": "T", "amino_acid2": "S"}, "(112, 252)": {"freq": 1, "color": "#187C054C", "amino_acid1": "F", "amino_acid2": "I"}, "(223, 346)": {"freq": 1, "color": "#C56E444C", "amino_acid1": "K", "amino_acid2": "A"}, "(336, 378)": {"freq": 1, "color": "#322C124C", "amino_acid1": "W", "amino_acid2": "L"}, "(179, 368)": {"freq": 1, "color": "#3897BE4C", "amino_acid1": "N", "amino_acid2": "I"}, "(184, 211)": {"freq": 1, "color": "#9836124C", "amino_acid1": "S", "amino_acid2": "P"}, "(113, 396)": {"freq": 1, "color": "#7131914C", "amino_acid1": "L", "amino_acid2": "Q"}, "(164, 234)": {"freq": 1, "color": "#4012104C", "amino_acid1": "W", "amino_acid2": "F"}, "(195, 201)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "K", "amino_acid2": "T"}, "(135, 185)": {"freq": 1, "color": "#F56C344C", "amino_acid1": "I", "amino_acid2": "R"}, "(157, 341)": {"freq": 1, "color": "#9D8FCF4C", "amino_acid1": "L", "amino_acid2": "I"}, "(228, 363)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "L", "amino_acid2": "N"}, "(166, 206)": {"freq": 1, "color": "#CF13414C", "amino_acid1": "L", "amino_acid2": "I"}, "(181, 182)": {"freq": 1, "color": "#48A2084C", "amino_acid1": "I", "amino_acid2": "H"}, "(78, 243)": {"freq": 1, "color": "#C803B64C", "amino_acid1": "A", "amino_acid2": "F"}, "(350, 398)": {"freq": 1, "color": "#C56E444C", "amino_acid1": "K", "amino_acid2": "Q"}, "(313, 322)": {"freq": 1, "color": "#D55D314C", "amino_acid1": "Q", "amino_acid2": "C"}, "(142, 179)": {"freq": 1, "color": "#9836124C", "amino_acid1": "P", "amino_acid2": "N"}, "(74, 243)": {"freq": 1, "color": "#14B38F4C", "amino_acid1": "K", "amino_acid2": "F"}, "(173, 246)": {"freq": 1, "color": "#9836124C", "amino_acid1": "R", "amino_acid2": "P"}, "(114, 398)": {"freq": 1, "color": "#C56E444C", "amino_acid1": "M", "amino_acid2": "Q"}, "(216, 235)": {"freq": 1, "color": "#E1A6634C", "amino_acid1": "Q", "amino_acid2": "V"}, "(116, 197)": {"freq": 1, "color": "#70E5764C", "amino_acid1": "L", "amino_acid2": "I"}, "(109, 183)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "T", "amino_acid2": "H"}, "(205, 244)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "G", "amino_acid2": "F"}, "(202, 398)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "I", "amino_acid2": "Q"}, "(268, 348)": {"freq": 1, "color": "#187C054C", "amino_acid1": "C", "amino_acid2": "I"}, "(113, 114)": {"freq": 1, "color": "#7131914C", "amino_acid1": "L", "amino_acid2": "M"}, "(201, 239)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "T", "amino_acid2": "S"}, "(168, 183)": {"freq": 1, "color": "#C803B64C", "amino_acid1": "A", "amino_acid2": "H"}, "(206, 268)": {"freq": 1, "color": "#CF13414C", "amino_acid1": "I", "amino_acid2": "C"}, "(75, 135)": {"freq": 1, "color": "#F56C344C", "amino_acid1": "N", "amino_acid2": "I"}, "(143, 189)": {"freq": 1, "color": "#9836124C", "amino_acid1": "L", "amino_acid2": "R"}, "(208, 361)": {"freq": 1, "color": "#4D21CB4C", "amino_acid1": "M", "amino_acid2": "L"}, "(93, 329)": {"freq": 1, "color": "#8EB2224C", "amino_acid1": "I", "amino_acid2": "F"}};
  var listItems = document.querySelectorAll('#myDropdown_mrmr_min_10 a');
  listItems.forEach(function (item) {
    toggleHighlight(item);

  });
}
else if (typeFS == "min_mrmr_1" ) {
  pair_dict = {"(197, 336)": {"freq": 15, "color": "#0000FFFF", "amino_acid1": "I", "amino_acid2": "W"}, "(179, 332)": {"freq": 8, "color": "#FF0000A5", "amino_acid1": "N", "amino_acid2": "F"}, "(143, 371)": {"freq": 2, "color": "#2A7E2A59", "amino_acid1": "L", "amino_acid2": "L"}, "(161, 336)": {"freq": 2, "color": "#0000FF59", "amino_acid1": "A", "amino_acid2": "W"}, "(179, 336)": {"freq": 2, "color": "#FF000059", "amino_acid1": "N", "amino_acid2": "W"}, "(92, 329)": {"freq": 2, "color": "#542CEE59", "amino_acid1": "N", "amino_acid2": "F"}, "(201, 336)": {"freq": 2, "color": "#FF000059", "amino_acid1": "T", "amino_acid2": "W"}, "(178, 184)": {"freq": 1, "color": "#BC42FF4C", "amino_acid1": "Q", "amino_acid2": "S"}, "(153, 159)": {"freq": 1, "color": "#8A0C664C", "amino_acid1": "Y", "amino_acid2": "S"}, "(189, 336)": {"freq": 1, "color": "#FF00004C", "amino_acid1": "R", "amino_acid2": "W"}, "(136, 336)": {"freq": 1, "color": "#FF00004C", "amino_acid1": "L", "amino_acid2": "W"}, "(204, 238)": {"freq": 1, "color": "#43A2314C", "amino_acid1": "V", "amino_acid2": "G"}, "(143, 372)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "L", "amino_acid2": "S"}, "(116, 330)": {"freq": 1, "color": "#1B81CB4C", "amino_acid1": "L", "amino_acid2": "F"}};
  var listItems = document.querySelectorAll('#myDropdown_mrmr_min_1 a');
  listItems.forEach(function (item) {
    toggleHighlight(item);

  });
} else if (typeFS == "mrmr_com_4" ) {
  pair_dict = {"(179, 336)": {"freq": 37, "color": "#0000FFFF", "amino_acid1": "N", "amino_acid2": "W"}, "(193, 202)": {"freq": 3, "color": "#2A7E2A56", "amino_acid1": "F", "amino_acid2": "I"}, "(193, 235)": {"freq": 2, "color": "#2A7E2A51", "amino_acid1": "F", "amino_acid2": "V"}, "(115, 398)": {"freq": 2, "color": "#7C397651", "amino_acid1": "S", "amino_acid2": "Q"}, "(143, 372)": {"freq": 2, "color": "#5FA40151", "amino_acid1": "L", "amino_acid2": "S"}, "(265, 266)": {"freq": 2, "color": "#9F531A51", "amino_acid1": "A", "amino_acid2": "T"}, "(197, 336)": {"freq": 2, "color": "#0000FF51", "amino_acid1": "I", "amino_acid2": "W"}, "(143, 177)": {"freq": 2, "color": "#5FA40151", "amino_acid1": "L", "amino_acid2": "I"}, "(107, 193)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "N", "amino_acid2": "F"}, "(176, 179)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "A", "amino_acid2": "N"}, "(142, 372)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "P", "amino_acid2": "S"}, "(216, 338)": {"freq": 1, "color": "#6B74344C", "amino_acid1": "Q", "amino_acid2": "P"}, "(183, 331)": {"freq": 1, "color": "#CCA55B4C", "amino_acid1": "H", "amino_acid2": "L"}, "(148, 193)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "C", "amino_acid2": "F"}, "(318, 335)": {"freq": 1, "color": "#4012104C", "amino_acid1": "E", "amino_acid2": "M"}, "(87, 119)": {"freq": 1, "color": "#D808554C", "amino_acid1": "L", "amino_acid2": "A"}, "(71, 362)": {"freq": 1, "color": "#3212D14C", "amino_acid1": "L", "amino_acid2": "L"}, "(92, 356)": {"freq": 1, "color": "#35A5834C", "amino_acid1": "N", "amino_acid2": "D"}, "(190, 336)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "T", "amino_acid2": "W"}, "(193, 385)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "F", "amino_acid2": "K"}, "(275, 353)": {"freq": 1, "color": "#196EE44C", "amino_acid1": "R", "amino_acid2": "C"}, "(73, 368)": {"freq": 1, "color": "#EC84254C", "amino_acid1": "E", "amino_acid2": "I"}, "(193, 206)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "F", "amino_acid2": "I"}, "(126, 215)": {"freq": 1, "color": "#04B7FC4C", "amino_acid1": "L", "amino_acid2": "L"}, "(145, 371)": {"freq": 1, "color": "#3C1DDB4C", "amino_acid1": "S", "amino_acid2": "L"}, "(198, 243)": {"freq": 1, "color": "#359CD14C", "amino_acid1": "A", "amino_acid2": "F"}, "(220, 360)": {"freq": 1, "color": "#5758A04C", "amino_acid1": "K", "amino_acid2": "A"}, "(212, 215)": {"freq": 1, "color": "#04B7FC4C", "amino_acid1": "V", "amino_acid2": "L"}, "(193, 257)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "F", "amino_acid2": "T"}, "(265, 275)": {"freq": 1, "color": "#9F531A4C", "amino_acid1": "A", "amino_acid2": "R"}, "(183, 227)": {"freq": 1, "color": "#CCA55B4C", "amino_acid1": "H", "amino_acid2": "C"}, "(105, 384)": {"freq": 1, "color": "#E714994C", "amino_acid1": "L", "amino_acid2": "N"}, "(253, 258)": {"freq": 1, "color": "#EA33364C", "amino_acid1": "T", "amino_acid2": "I"}, "(193, 265)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "F", "amino_acid2": "A"}, "(143, 166)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "L", "amino_acid2": "L"}, "(180, 184)": {"freq": 1, "color": "#175E5B4C", "amino_acid1": "P", "amino_acid2": "S"}, "(193, 214)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "F", "amino_acid2": "G"}, "(140, 386)": {"freq": 1, "color": "#7497A84C", "amino_acid1": "R", "amino_acid2": "T"}, "(151, 177)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "W", "amino_acid2": "I"}, "(111, 183)": {"freq": 1, "color": "#CCA55B4C", "amino_acid1": "Y", "amino_acid2": "H"}, "(141, 196)": {"freq": 1, "color": "#7131914C", "amino_acid1": "W", "amino_acid2": "I"}, "(196, 398)": {"freq": 1, "color": "#7131914C", "amino_acid1": "I", "amino_acid2": "Q"}, "(129, 190)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "P", "amino_acid2": "T"}, "(193, 390)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "F", "amino_acid2": "A"}, "(193, 212)": {"freq": 1, "color": "#2A7E2A4C", "amino_acid1": "F", "amino_acid2": "V"}, "(142, 388)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "P", "amino_acid2": "R"}, "(228, 376)": {"freq": 1, "color": "#F0ADEF4C", "amino_acid1": "L", "amino_acid2": "N"}, "(123, 191)": {"freq": 1, "color": "#83BD064C", "amino_acid1": "L", "amino_acid2": "K"}, "(245, 246)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "I", "amino_acid2": "P"}, "(143, 369)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "L", "amino_acid2": "G"}, "(143, 370)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "L", "amino_acid2": "Y"}, "(91, 190)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "G", "amino_acid2": "T"}, "(144, 182)": {"freq": 1, "color": "#D3AECA4C", "amino_acid1": "P", "amino_acid2": "H"}, "(141, 391)": {"freq": 1, "color": "#7131914C", "amino_acid1": "W", "amino_acid2": "F"}, "(313, 314)": {"freq": 1, "color": "#EE071C4C", "amino_acid1": "Q", "amino_acid2": "S"}, "(105, 193)": {"freq": 1, "color": "#E714994C", "amino_acid1": "L", "amino_acid2": "F"}, "(178, 245)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "Q", "amino_acid2": "I"}, "(184, 223)": {"freq": 1, "color": "#175E5B4C", "amino_acid1": "S", "amino_acid2": "K"}, "(153, 193)": {"freq": 1, "color": "#E714994C", "amino_acid1": "Y", "amino_acid2": "F"}, "(86, 227)": {"freq": 1, "color": "#CCA55B4C", "amino_acid1": "I", "amino_acid2": "C"}, "(94, 338)": {"freq": 1, "color": "#6B74344C", "amino_acid1": "L", "amino_acid2": "P"}, "(104, 193)": {"freq": 1, "color": "#E714994C", "amino_acid1": "K", "amino_acid2": "F"}, "(114, 398)": {"freq": 1, "color": "#7131914C", "amino_acid1": "M", "amino_acid2": "Q"}, "(173, 241)": {"freq": 1, "color": "#8028334C", "amino_acid1": "R", "amino_acid2": "V"}, "(142, 191)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "P", "amino_acid2": "K"}, "(193, 319)": {"freq": 1, "color": "#E714994C", "amino_acid1": "F", "amino_acid2": "Q"}, "(84, 347)": {"freq": 1, "color": "#11FA044C", "amino_acid1": "V", "amino_acid2": "V"}, "(197, 206)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "I", "amino_acid2": "I"}, "(200, 397)": {"freq": 1, "color": "#C9533E4C", "amino_acid1": "W", "amino_acid2": "C"}, "(228, 378)": {"freq": 1, "color": "#F0ADEF4C", "amino_acid1": "L", "amino_acid2": "L"}, "(82, 191)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "A", "amino_acid2": "K"}, "(97, 396)": {"freq": 1, "color": "#FFF3664C", "amino_acid1": "M", "amino_acid2": "Q"}, "(76, 130)": {"freq": 1, "color": "#6BFB024C", "amino_acid1": "W", "amino_acid2": "V"}, "(111, 205)": {"freq": 1, "color": "#CCA55B4C", "amino_acid1": "Y", "amino_acid2": "G"}, "(374, 386)": {"freq": 1, "color": "#7497A84C", "amino_acid1": "A", "amino_acid2": "T"}, "(197, 202)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "I", "amino_acid2": "I"}, "(90, 151)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "A", "amino_acid2": "W"}, "(133, 372)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "L", "amino_acid2": "S"}, "(142, 193)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "P", "amino_acid2": "F"}, "(76, 183)": {"freq": 1, "color": "#6BFB024C", "amino_acid1": "W", "amino_acid2": "H"}, "(95, 246)": {"freq": 1, "color": "#8DF05D4C", "amino_acid1": "V", "amino_acid2": "P"}, "(150, 197)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "V", "amino_acid2": "I"}, "(128, 141)": {"freq": 1, "color": "#7131914C", "amino_acid1": "M", "amino_acid2": "W"}, "(165, 243)": {"freq": 1, "color": "#359CD14C", "amino_acid1": "H", "amino_acid2": "F"}, "(207, 398)": {"freq": 1, "color": "#7131914C", "amino_acid1": "S", "amino_acid2": "Q"}, "(216, 344)": {"freq": 1, "color": "#6B74344C", "amino_acid1": "Q", "amino_acid2": "I"}, "(79, 190)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "L", "amino_acid2": "T"}, "(147, 184)": {"freq": 1, "color": "#175E5B4C", "amino_acid1": "L", "amino_acid2": "S"}, "(203, 242)": {"freq": 1, "color": "#765D304C", "amino_acid1": "S", "amino_acid2": "S"}, "(119, 190)": {"freq": 1, "color": "#D808554C", "amino_acid1": "A", "amino_acid2": "T"}, "(160, 203)": {"freq": 1, "color": "#765D304C", "amino_acid1": "T", "amino_acid2": "S"}, "(193, 201)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "F", "amino_acid2": "T"}, "(168, 247)": {"freq": 1, "color": "#F7EA494C", "amino_acid1": "A", "amino_acid2": "L"}, "(160, 395)": {"freq": 1, "color": "#765D304C", "amino_acid1": "T", "amino_acid2": "I"}, "(77, 184)": {"freq": 1, "color": "#175E5B4C", "amino_acid1": "S", "amino_acid2": "S"}, "(189, 193)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "R", "amino_acid2": "F"}, "(141, 373)": {"freq": 1, "color": "#7131914C", "amino_acid1": "W", "amino_acid2": "S"}, "(149, 226)": {"freq": 1, "color": "#C4861C4C", "amino_acid1": "A", "amino_acid2": "S"}, "(123, 151)": {"freq": 1, "color": "#83BD064C", "amino_acid1": "L", "amino_acid2": "W"}, "(193, 262)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "F", "amino_acid2": "Q"}, "(220, 357)": {"freq": 1, "color": "#5758A04C", "amino_acid1": "K", "amino_acid2": "V"}, "(340, 346)": {"freq": 1, "color": "#D2BEF24C", "amino_acid1": "F", "amino_acid2": "A"}, "(313, 359)": {"freq": 1, "color": "#EE071C4C", "amino_acid1": "Q", "amino_acid2": "G"}, "(116, 398)": {"freq": 1, "color": "#7131914C", "amino_acid1": "L", "amino_acid2": "Q"}, "(144, 193)": {"freq": 1, "color": "#D3AECA4C", "amino_acid1": "P", "amino_acid2": "F"}, "(202, 212)": {"freq": 1, "color": "#0000FF4C", "amino_acid1": "I", "amino_acid2": "V"}, "(71, 184)": {"freq": 1, "color": "#3212D14C", "amino_acid1": "L", "amino_acid2": "S"}, "(193, 242)": {"freq": 1, "color": "#D3AECA4C", "amino_acid1": "F", "amino_acid2": "S"}, "(166, 394)": {"freq": 1, "color": "#5FA4014C", "amino_acid1": "L", "amino_acid2": "Y"}, "(115, 141)": {"freq": 1, "color": "#7C39764C", "amino_acid1": "S", "amino_acid2": "W"}, "(193, 226)": {"freq": 1, "color": "#D3AECA4C", "amino_acid1": "F", "amino_acid2": "S"}, "(183, 360)": {"freq": 1, "color": "#6BFB024C", "amino_acid1": "H", "amino_acid2": "A"}, "(259, 263)": {"freq": 1, "color": "#6A675F4C", "amino_acid1": "K", "amino_acid2": "K"}, "(149, 193)": {"freq": 1, "color": "#C4861C4C", "amino_acid1": "A", "amino_acid2": "F"}, "(74, 367)": {"freq": 1, "color": "#1B81CB4C", "amino_acid1": "K", "amino_acid2": "W"}, "(94, 228)": {"freq": 1, "color": "#6B74344C", "amino_acid1": "L", "amino_acid2": "L"}};
  var listItems = document.querySelectorAll('#myDropdown_mrmr_com_4 a');
  listItems.forEach(function (item) {
    toggleHighlight(item);

  });
}
    var reversed_dict = {};

    var keys = Object.keys(pair_dict).reverse();

    $.each(keys, function(index, key) {
      reversed_dict[key] = pair_dict[key];
    });

    console.log('Key:');
    $.each(reversed_dict, function(key, value) {
      const match = key.match(/\((\d+), (\d+)\)/); // Use a regular expression to extract numbers

      if (match) {
        var firstNumber = parseInt(match[1]); // Parse the first number as an integer
        var secondNumber = parseInt(match[2]); // Parse the second number as an integer

        console.log(firstNumber); // Output: 179
        console.log("LALA"); // Output: 179
        console.log(secondNumber); // Output: 336
      }
      var frequency = value.freq;
      var color = value.color;
      
      console.log('Key:', key);
      console.log('Frequency:', frequency);
      console.log('Color:', color);
      $('#'+plotid).find("#"+firstNumber).css("fill", color);
      $('#'+plotid).find("#"+secondNumber).css("fill", color);

      // You can perform additional operations here with frequency and color
    });

}


function select_residue(plotid) {

  // resetColors(plotid);
  key = '120';
  $('#'+plotid).find("#"+key).css("fill", '#E60A0A');
    // original_title = $('#'+plotid).find("#"+key).attr('original_title')


    // $('#'+plotid).find("#"+key).attr('title',original_title+extra);
    // $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);
    
    // $("circle").tooltip('fixTitle');
    // $("text").tooltip('fixTitle');

    // console.log('Key:');
    // $.each(mrmr_res_10, function(key, value) {
    //   var frequency = value.freq;
    //   var color = value.color;
      
    //   console.log('Key:', key);
    //   console.log('Frequency:', frequency);
    //   console.log('Color:', color);
    //   $('#'+plotid).find("#"+key).css("fill", color);

    //   // You can perform additional operations here with frequency and color
    // });

}

function maxmin() {
    // console.log('maxmin start');
    margin = 50;
    svgmax = 0;
    svgmin = 0;
    x_svgmax = 0;
    count = 0;
    classmax = '';
    classmin = '';
    counter = 0;
    if (!$('#snake').length) return
    // console.log("temp",y_max,y_min);
    $('#snake').children('.rtext').each(function () {
        counter += 1;
        y = parseInt($(this).attr( "y" ));
        x = parseInt($(this).attr( "x" ));
        classtext = $(this).attr( "class" );
        // test = $(this).attr("original_title");
        // test2 = $(this).css("display");
        if ($(this).css("display")!='none') {
            count = count +1;
            if (y<svgmin) {
                svgmin = y;
                classmin = classtext;
                }
            if (y>svgmax) {
                classmax = classtext;
                svgmax= y;
             }
            if (x>x_svgmax) x_svgmax = x;

        }
    });

    // Alternative for height - otherwise the height of the element itself is skipped
    //svgmax = document.getElementById('snake').getBBox().height;

    // if (svgmin>y_min) svgmin = y_min;
    // if (svgmax<y_max) svgmax = y_max;

    // console.log('max '+svgmax+' '+classmax+' min'+svgmin+' '+classmin+' count'+count);

    var svg = $('#snake').closest('svg')[0];
    check = document.getElementById("snakeplot").getAttribute('viewBox');
    // console.log('check',check)
    if (typeof check !== typeof undefined && check !== false && check !== null ) {
      oldheight = check.split(" ")[3];
      width = check.split(" ")[2];
    } else {
      // console.log('not found it');
      oldheight = $(svg).attr('height');
      width = $("#snakeplot").attr('width');
    }

    newheight = (svgmax-svgmin+margin*2)+margin/2; // add extra border/padding

    // console.log('New height:'+ newheight +' old height:'+oldheight);
    // console.log("Prev attr"+$('#snake').attr("transform"));
    if (newheight!=oldheight) {
        svg.setAttribute('height', (svgmax-svgmin+margin*2));
        $('#snake').attr("transform", "translate(0," + (-svgmin+margin) + ")");

        // $('#snakeplot')[0].attr("viewBox", "0 0 " + width + " " + newheight);
        document.getElementById("snakeplot").setAttribute("viewBox", "0 0 " + width + " " + newheight);


        svg.setAttribute('height', "100%");
        svg.setAttribute('width', "100%");
    }

    // console.log("New attr"+$('#snake').attr("transform"));
    // console.log('maxmin done');
}

$( document ).ready(function() {
    // var elements = document.getElementsByClassName('long')

    // for (var i = 0; i < elements.length; i++){
    //     elements[i].style.display = 'none';
    // }
    y_min = 0;
    y_max = 0;
    // maxmin();
    $(".long").hide();


    $('rect').each(function(){

        rectclass = $(this).attr('class');
        if (rectclass) {
            if (rectclass.indexOf("CL") >= 0 && rectclass.indexOf("long") >= 0) {

                numResidues = ($('.'+rectclass.replace(/ /g,".")).length-3)/2

                // console.log('class:'+rectclass+' count'+numResidues);

                if (numResidues<10) {
                    toggleLoop('.'+rectclass.split(' ')[0],'',1);
                }
            }
        }
    });

    maxmin();

    $("text").tooltip({
        'container': 'body',
        'placement': 'top',
        'animation': false,
        'html' : true
    });


    $("circle").tooltip({
        'container': 'body',
        'placement': 'top',
        'animation': false,
        'html' : true
    });

    $("circle").hover(function(){
        $('.tooltip').css('top',parseInt($('.tooltip').css('top')) + 2.8 + 'px')
    });

});

$(".rtext").click(function() {
    parentid = $(this).closest('svg').attr('id');
    newcolor = $(".pick-color."+parentid+".selected").attr('id');
    if (newcolor) {
      newcolor = newcolor.split('-');
    } else {
      custom =  $("#custom_color_"+parentid).val();
      custom_text = getContrast50(custom);
      newcolor = ["pick",custom,custom_text];
    }
  console.log(newcolor);

  $(this).css("fill", newcolor[2]);
  $(this).prev().css("fill", newcolor[1]);
});

$(".rcircle").click(function() {
    parentid = $(this).closest('svg').attr('id');
    newcolor = $(".pick-color."+parentid+".selected").attr('id');

    if (newcolor) {
      newcolor = newcolor.split('-');
    } else {
      custom =  $("#custom_color_"+parentid).val();
      custom_text = getContrast50(custom);
      newcolor = ["pick",custom,custom_text];
    }
  console.log(newcolor);
  $(this).css("fill", newcolor[1]);
  $(this).next().css("fill", newcolor[2]);
});



$("#snake_svg_link").click(function() {
    svgAsDataUri(document.getElementById("snakeplot"),{}, function(uri) {
        $("#snake_svg_link").attr('href',uri);
    });
});
$("#helix_svg_link").click(function() {
    svgAsDataUri(document.getElementById("helixbox"),{}, function(uri) {
        $("#helix_svg_link").attr('href',uri);
    });
});

function ajaxMutants(plotid,protein) {

  resetColors(plotid);
  

    $.getJSON( '/mutations/ajax/'+protein+'/', function( data ) {
      $.each( data, function( key, val ) {
        console.log(data,key, val);
         var ligands = [], bigincreases=0, increases = 0, bigdecreases=0, decreases = 0, unchanged=0, unspecified = 0;


         $.each( val, function( key, v ) {
          if( !(ligands[v[1]]) ) ligands[v[1]] = [];
          ligands[v[1]].push(v[0])
          if (v[0]>10) {
            bigincreases ++; //mix-up increase is decrease.
          } else if (v[0]>5) {
            increases ++;
          } else if (v[0]>0) {
            unchanged ++;
          }  else if (v[0]<-10) {
            bigdecreases ++;
          } else if (v[0]<-5) {
            decreases ++;
          } else if (v[0]<0) {
            unchanged ++;
          } else if (v[2]=='No effect on') {
            unchanged ++;
          } else if (v[2]=='No effect') {
            unchanged ++;
          } else if (v[2]=='Abolish') {
            bigincreases ++;
          } else if (v[2]=='Abolished effect') {
            bigincreases ++;
          } else if (v[2]=='Gain of') {
            bigdecreases ++;
          } else if (v[2]=='Increase') {
            increases ++;
          } else if (v[2]=='Decrease') {
            decreases ++;
          } else {
            unspecified ++;
          }
         });

         extra = "\n" + String(val[0].length) + " mutations: " +
          (decreases+bigdecreases) +" increases | " +
         (increases+bigincreases) +" decreases  |  " +
          (unchanged) +" Unchanged | " +
          unspecified + " Unspecified";

        counts = [(increases+bigincreases),(decreases+bigdecreases),(unchanged)];
        winner = counts.indexOf(Math.max.apply(window,counts));
        winner2 = Math.max.apply(window,counts);
        color = "#D9D7CE";
        color_letter = "#000";
        // if (winner==0 && winner2) {
        //   if (increases>bigincreases) {
        //     color = "#FF7373";
        //     color_letter = "#FFF";
        //   } else {
        //     color = "#FA1111";
        //     color_letter = "#FDFF7B";
        //   }
        // } else if (winner==1) {
        //   if (decreases>bigdecreases) {
        //     color = "#87E88F";
        //   } else {
        //     color = "#66B36C";
        //   }
        // } else if (winner==2) {
        //   color = "#F7DA00";
        //   color_letter = "#000";
        // }

        if (bigincreases>0) {
            color = "#FF7373";
            color_letter = "#FFF";
        } else if (increases>0) {
            color = "#FA1111";
            color_letter = "#FDFF7B";
        } else if (bigdecreases>0) {
            color = "#66B36C";
        } else if (decreases>0) {
            color = "#87E88F";
        } else  {
          color = "#F7DA00";
          color_letter = "#000";
        }

        console.log(counts + " " + counts.indexOf(Math.max.apply(window,counts)));


         original_title = $('#'+plotid).find("#"+key).attr('original_title')

         $('#'+plotid).find("#"+key).css("fill", color);
         $('#'+plotid).find("#"+key).next().css("fill",color_letter );
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

    });
}

function ajaxMutantsPos(plotid) {

  resetColors(plotid);

    var pos = jQuery.parseJSON(mutant_json);

    $.each( pos, function( key, val ) {
         var ligands = [], bigincreases=0, increases = 0, bigdecreases=0, decreases = 0, unchanged=0, unspecified = 0;


         $.each( val[0], function( key, v ) {
          if( !(ligands[v[1]]) ) ligands[v[1]] = [];
          ligands[v[1]].push(v[0])
          if (v[0]>10) {
            bigincreases ++; //mix-up increase is decrease.
          } else if (v[0]>5) {
            increases ++;
          } else if (v[0]>0) {
            unchanged ++;
          } else if (v[0]<-10) {
            bigdecreases ++;
          } else if (v[0]<-5) {
            decreases ++;
          } else if (v[0]<0) {
            unchanged ++;
          } else if (v[2]=='No effect on') {
            unchanged ++;
          } else if (v[2]=='No effect') {
            unchanged ++;
          } else if (v[2]=='Abolish') {
            bigincreases ++;
          } else if (v[2]=='Abolished effect') {
            bigincreases ++;
          } else if (v[2]=='Gain of') {
            bigdecreases ++;
          } else if (v[2]=='Increase') {
            increases ++;
          } else if (v[2]=='Decrease') {
            decreases ++;
          } else {
            unspecified ++;
          }
         });

         extra = "\n" + String(val[0].length) + " mutations: " +
          (decreases+bigdecreases) +" increases | " +
         (increases+bigincreases) +" decreases  |  " +
          (unchanged) +" Unchanged | " +
          unspecified + " Unspecified";

        counts = [(increases+bigincreases),(decreases+bigdecreases),(unchanged)];
        winner = counts.indexOf(Math.max.apply(window,counts));
        winner2 = Math.max.apply(window,counts);
        color = "#D9D7CE";
        color_letter = "#000";

        if (bigincreases>0) {
          color = "#FA1111";
          color_letter = "#FDFF7B";
        } else if (increases>0) {
          color = "#FF7373";
          color_letter = "#FFF";
        } else if (bigdecreases>0) {
            color = "#66B36C";
        } else if (decreases>0) {
            color = "#87E88F";
        } else  {
          color = "#F7DA00";
          color_letter = "#000";
        }

         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", color);
         $('#'+plotid).find("#"+key).next().css("fill",color_letter );
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');


}



function ajaxInteractions(plotid,protein) {

  resetColors(plotid);

    key = '120';
    $('#'+plotid).find("#"+key).css("fill", "#E60A0A");
    $('#'+plotid).find("#"+key).next().css("fill", "#FDFF7B");

    // original_title = $('#'+plotid).find("#"+key).attr('original_title')


    // $('#'+plotid).find("#"+key).attr('title',original_title+extra);
    // $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);
    
    // $("circle").tooltip('fixTitle');
    // $("text").tooltip('fixTitle');

    console.log('Key:');
    $.each(mrmr_res_10, function(key, value) {
      var frequency = value.freq;
      var color = value.color;
      
      console.log('Key:', key);
      console.log('Frequency:', frequency);
      console.log('Color:', color);
      $('#'+plotid).find("#"+key).css("fill", color);

      // You can perform additional operations here with frequency and color
    });


    
    // $.getJSON( '/interaction/ajax/'+protein+'/', function( data ) {
    //   $.each( data, function( key, val ) {

    //     var flags = [], falgsAA = [], output = [], outputAA = [], l = val.length, i;
    //     for( i=0; i<l; i++) {
    //         if( flags[val[i][1]]) continue;
    //         flags[val[i][1]] = true;
    //         output.push(val[i][1]);
    //     }
    //     for( i=0; i<l; i++) {
    //         if( flags[val[i][0]]) continue;
    //         flags[val[i][0]] = true;
    //         outputAA.push(val[i][0]);
    //     }

    //      extra = "\n" + String(val.length) + " interactions | Type: "+ output +" | Residue in crystal:"+ outputAA;


    //      $('#'+plotid).find("#"+key).css("fill", "#E60A0A");
    //      $('#'+plotid).find("#"+key).next().css("fill", "#FDFF7B");

    //      original_title = $('#'+plotid).find("#"+key).attr('original_title')


    //      $('#'+plotid).find("#"+key).attr('title',original_title+extra);
    //      $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


    //   });
    // $("circle").tooltip('fixTitle');
    // $("text").tooltip('fixTitle');

    // });
}

function ajaxBarcode(plotid,protein) {

  resetColors(plotid);

    var textboxvalue = $('input[name=cutoff]').val();
    $.getJSON( '/signprot/ajax/barcode/'+protein+'/'+textboxvalue, function( data ) {
      $.each( data, function( key, val ) {

        if (val[1]=='Conserved') {
            color = "#b162a7";
            color_letter = "#fefdfd";
            $('#'+plotid).find("#"+key).next().css("fill", color_letter);
            extra = "\n" + String(val[1]);
        } else if (val[1]=='Evolutionary neutral') {
            color = "#f8dfb4";
            extra = "\n" + String(val[1]);
        } else if (val[1]=='NA') {
            color = "#ffffff"
            extra = "\n" + String(val[1]);
        } else  {
            color = "#4dc7e6";
            extra = "\n" + String(val[1]);
        }

         original_title = $('#'+plotid).find("#"+key).attr('original_title')

         $('#'+plotid).find("#"+key).css("fill", color);
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);

      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

    });
}
function ajaxCancerMutation(plotid, protein) {

  resetColors(plotid);

    $.getJSON( '/mutational_landscape/ajax/CancerMutation/'+protein+'/', function( data ) {
      $.each( data, function( key, val ) {
        // NM.allele_frequency, NM.allele_count, NM.allele_number, NM.number_homozygotes
         extra = "\nAAchange: " + "-->" + String(val[0]);

         color = "#7572b1";
         color_letter = "#fefdfd";
         $('#'+plotid).find("#"+key).next().css("fill", color_letter);

         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", color);
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

    });
}

function ajaxDiseaseMutation(plotid, protein) {

  resetColors(plotid);

    $.getJSON( '/mutational_landscape/ajax/DiseaseMutation/'+protein+'/', function( data ) {
      $.each( data, function( key, val ) {
        // NM.allele_frequency, NM.allele_count, NM.allele_number, NM.number_homozygotes
         extra = "\nAAchange: " + "-->" + String(val[0]);

         color = "#52133b";
         color_letter = "#fefdfd";
         $('#'+plotid).find("#"+key).next().css("fill", color_letter);

         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", color);
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

    });
}
function ajaxNaturalMutation(plotid, protein) {

  resetColors(plotid);

    $.getJSON( '/mutational_landscape/ajax/NaturalMutation/'+protein+'/', function( data ) {
      $.each( data, function( key, val ) {
         extra = "\nType: " + "-->" + String(val[5]) +
         "\nAAchange: " + "-->" + String(val[0]) +
         "\nAllele Frequency: " + String(val[1]) +
         "\nAllele Count: " + String(val[2]) +
         "\nAllele Number: " + String(val[3]) +
        "\nNumber of Homozygotes: " + String(val[4]) +
        "\nFunctional Annotation: " + String(val[8]) +
        "\nPredicted effect (SIFT/PolyPhen): <span style='color:"+String(val[7])+"'> "+ String(val[6]);

        //  color = "#c40100";
         $('#'+plotid).find("#"+key).next().css("fill", "#fefdfd");
         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", String(val[7]));
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

    });
}

function ajaxNaturalMutationPos(plotid) {

  resetColors(plotid);

    var pos = jQuery.parseJSON(natural_mutations_json);

    var color_code = pos['color']

      $.each(pos, function( key, val ) {
         //console.log("Yes", pos);

         extra = "\nVariants: " + "-->" + String(val['AA']) +
        "\nNumber of Proteins: " + String(val['val']);

         if (val['val']==0) {
            color_letter = "#000000"
         } else  {
            color_letter = "#fefdfd";
         }

         color = color_code[val['val']-1];
         $('#'+plotid).find("#"+key).next().css("fill", color_letter);

         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", color);
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);

      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');
}

function ajaxPTMs(plotid, protein) {

  resetColors(plotid);

    $.getJSON( '/mutational_landscape/ajax/PTM/'+protein+'/', function( data ) {
      $.each( data, function( key, val ) {
         extra = "\nModification: " + String(val[0]);

         $('#'+plotid).find("#"+key).next().css("fill", "#fefdfd");
         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", "#000000");
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

    });
}

function ajaxPTMPos(plotid) {

  resetColors(plotid);

    var pos = jQuery.parseJSON(ptms_json);

    var color_code = pos['color']

      $.each(pos, function( key, val ) {

         extra = "\nModifications: " + String(val['mod']);

         $('#'+plotid).find("#"+key).next().css("fill", "#fefdfd");

         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", "#000000");
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);

      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');
}

function ajaxCancerMutationPos(plotid) {

  resetColors(plotid);

    var pos = jQuery.parseJSON(cancer_mutations_json);

    var color_code = pos['color']

      $.each(pos, function( key, val ) {

         extra = "\nAAchanges: " + "-->" + String(val['AA']) +
        "\nNumber of Proteins: " + String(val['val']);

         if (val['val']==0) {
            color_letter = "#000000"
         } else  {
            color_letter = "#fefdfd";
         }

         color = color_code[val['val']-1];
         $('#'+plotid).find("#"+key).next().css("fill", color_letter);

         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", color);
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

}

function ajaxDiseaseMutationPos(plotid) {

  resetColors(plotid);

    var pos = jQuery.parseJSON(disease_mutations_json);

    var color_code = pos['color']

      $.each(pos, function( key, val ) {

         extra = "\nAAchanges: " + "-->" + String(val['AA']) +
        "\nNumber of Proteins: " + String(val['val']);

         color_letter = "#fefdfd";
         color = color_code[val['val']-1];
         $('#'+plotid).find("#"+key).next().css("fill", color_letter);

         original_title = $('#'+plotid).find("#"+key).attr('original_title')
         $('#'+plotid).find("#"+key).css("fill", color);
         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');
}

function ajaxInterface(plotid,protein) {

  resetColors(plotid);

    $.getJSON( '/signprot/ajax/interface/'+protein+'/', function( data ) {
      $.each( data, function( key, val ) {

         extra = "\n" + String("Receptor interface position");
         $('#'+plotid).find("#"+key).css("fill", "#e60a0a");
         $('#'+plotid).find("#"+key).next().css("fill", "#fafb74");

         original_title = $('#'+plotid).find("#"+key).attr('original_title')

         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

    });
}

function ajaxInteractionsPos(plotid) {

  resetColors(plotid);


  var pos = jQuery.parseJSON(interaction_json);

      $.each( pos, function( key, val ) {

        var flags = [], falgsAA = [], output = [], outputAA = [], l = val.length, i;
        for( i=0; i<l; i++) {
            if( flags[val[i][1]]) continue;
            flags[val[i][1]] = true;
            output.push(val[i][1]);
        }
        for( i=0; i<l; i++) {
            if( flags[val[i][0]]) continue;
            flags[val[i][0]] = true;
            outputAA.push(val[i][0]);
        }

         extra = "\n" + String(val.length) + " interactions | Type: "+ output +" | Residue in crystal:"+ outputAA;


         $('#'+plotid).find("#"+key).css("fill", "#E60A0A");
         $('#'+plotid).find("#"+key).next().css("fill", "#FDFF7B");

         original_title = $('#'+plotid).find("#"+key).attr('original_title')


         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

}

function construct_annotations(plotid) {

  resetColors(plotid);

  var pos = jQuery.parseJSON(annotations_json);

      $.each( pos, function( key, val ) {

        // var flags = [], falgsAA = [], output = [], outputAA = [], l = val.length, i;
        // for( i=0; i<l; i++) {
        //     if( flags[val[i][1]]) continue;
        //     flags[val[i][1]] = true;
        //     output.push(val[i][1]);
        // }
        // for( i=0; i<l; i++) {
        //     if( flags[val[i][0]]) continue;
        //     flags[val[i][0]] = true;
        //     outputAA.push(val[i][0]);
        // }

        //  extra = "\n" + String(val.length) + " interactions | Type: "+ output +" | Residue in crystal:"+ outputAA;
         extra = "<br>"+val[1]; //.replace(/<br>/g, '&#013;');


         $('#'+plotid).find("#"+key).css("fill", val[2]);
         $('#'+plotid).find("#"+key).next().css("fill", val[3]);

         original_title = $('#'+plotid).find("#"+key).attr('original_title')

         $('#'+plotid).find("#"+key).attr('title',original_title+extra);
         $('#'+plotid).find("#"+key+"t").attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

}

function ajaxInteractionsLigand(protein,ligand) {

    resetColors('snakeplot');
    resetColors('helixbox');

    $.getJSON( '/interaction/ajaxLigand/'+protein+'/'+ligand, function( data ) {
      $.each( data, function( key, val ) {

        var flags = [], falgsAA = [], output = [], outputAA = [], l = val.length, i;
        for( i=0; i<l; i++) {
            if( flags[val[i][1]]) continue;
            flags[val[i][1]] = true;
            output.push(val[i][1]);
        }
        for( i=0; i<l; i++) {
            if( flags[val[i][0]]) continue;
            flags[val[i][0]] = true;
            outputAA.push(val[i][0]);
        }

         extra = "\n" + String(val.length) + " interactions | Type: "+ output +" | Residue in crystal:"+ outputAA;


         $('[id='+key+']').css("fill", "#E60A0A");
         $('[id='+key+']').next().css("fill", "#FDFF7B");

         original_title = $("#"+key).attr('original_title')

         $('[id='+key+']').attr('title',original_title+extra);
         $('[id='+key+'t]').attr('title',original_title+extra);


      });
    $("circle").tooltip('fixTitle');
    $("text").tooltip('fixTitle');

    });
}


$(".pick-color").click(function() {
    plottype = $(this).attr('class').split(' ')[1];

    console.log($(this).attr('id'));
    $(".pick-color."+plottype).css('borderWidth','2px');
    $(".pick-color."+plottype).css('height','20px');
    $(".pick-color."+plottype).removeClass('selected');
    $(this).css('borderWidth','3px');
    $(this).css('height','22px');
    $(this).addClass('selected');

});

$( document ).ready(function() {
  if ( $( "#cp2_helixbox" ).length ) {
    $('#cp2_helixbox').colorpicker();
  }
  if ( $( "#cp2_snakeplot" ).length ) {
    $('#cp2_snakeplot').colorpicker();
  }
});

function getContrast50(hexcolor){
     return (parseInt(hexcolor.replace('#', ''), 16) > 0xffffff/2) ? 'black':'white';
}

function reload_tooltips() {
    $("text").tooltip({
        'container': 'body',
        'placement': 'top',
        'animation': false,
        'html' : true
    });


    $("circle").tooltip({
        'container': 'body',
        'placement': 'top',
        'animation': false,
        'html' : true
    });

    $("circle").hover(function(){
        $('.tooltip').css('top',parseInt($('.tooltip').css('top')) + 2.8 + 'px')
    });
}
