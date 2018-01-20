function RGB2Color(r,g,b)
  {
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
  }

function rainbow(e){
	var frequency = 1
	var e = e

	for (var i = 0; i < e.length; i++) {
    	var f = $('#'+e[i]).data('frequency');
		f += 0.1
		var maintxtred = Math.sin(f) * 127 + 128;
		var maintxtgrn = Math.sin(f+2) * 127 + 128;
		var maintxtblu = Math.sin(f+4) * 127 + 128;
		document.getElementById(e[i]).style.color = RGB2Color(maintxtred, maintxtgrn, maintxtblu);
		$('#'+e[i]).data('frequency',f);
	}
  }

  function rainbowbuttons(e, o=0.5, b=true){

var frequency = 1
	var e = e

	for (var i = 0; i < e.length; i++) {
    	var f = $('#'+e[i]).data('frequency');
		f += 0.1
		var maintxtred = Math.sin(f) * 127 + 128;
		var maintxtgrn = Math.sin(f+2) * 127 + 128;
		var maintxtblu = Math.sin(f+4) * 127 + 128;
		document.getElementById(e[i]).style.color = RGB2Color(maintxtred, maintxtgrn, maintxtblu);
		rgb_value = (Math.round(255 - maintxtred)).toString() + "," + (Math.round(255 - maintxtgrn)).toString()  + "," + (Math.round(255 - maintxtblu)).toString() 
		if ($('#'+e[i]).is(":hover")){
			$('#'+e[i]).css('backgroundColor', 'rgba(' + rgb_value.toString() + ', 1)');
			$('#'+e[i]).css('borderColor', 'rgba(' + rgb_value.toString() + ', 1)');
		}
		else {
			$('#'+e[i]).css('backgroundColor', 'rgba(' + rgb_value.toString() + ', '+o.toString()+')');
			if (b) {$('#'+e[i]).css('borderColor', RGB2Color(maintxtred, maintxtgrn, maintxtblu));}
			else {$('#'+e[i]).css('borderColor', 'rgba(' + rgb_value.toString() + ', 1)');
}
		}
		$('#'+e[i]).data('frequency',f);
	}
  }


function rainbowprogressbar(e){
var frequency = 1
	var e = e

	for (var i = 0; i < e.length; i++) {
    	var f = $('#'+e[i]).data('frequency');
		f += 0.1
		var maintxtred = Math.sin(f) * 127 + 128;
		var maintxtgrn = Math.sin(f+2) * 127 + 128;
		var maintxtblu = Math.sin(f+4) * 127 + 128;
		rgb_value = (Math.round(255 - maintxtred)).toString() + "," + (Math.round(255 - maintxtgrn)).toString()  + "," + (Math.round(255 - maintxtblu)).toString() 
		$('#'+e[i]).css('backgroundColor', 'rgba(' + rgb_value.toString() + ', 1)');
		document.getElementById(e[i]).style.color = RGB2Color(maintxtred, maintxtgrn, maintxtblu);
		$('#'+e[i]).data('frequency',f);
		}
	}
 