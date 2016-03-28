// Проверка текстового поля на число в момент ввода данных
function fieldNumber(e,max){
	
	if(!max){ var max = 555555555555555; }
	
	$(e).bind('keyup keypress change', function(){
	    
		var str = $(this).val();
		var new_str = s = "";
		
		for(var i=0; i < str.length; i++){
			
			s = str.substr(i,1);
			
			if(s!=" " && isNaN(s) == false){// если цифра
				new_str += s;
			}
		}
		if(eval(new_str) > max){ new_str = max; }
		if(eval(new_str) == 0){ new_str = ""; }
		
		$(e).val(new_str);
		
	}).click(function(){
	    this.select();
	});
}
// получает позицию фокуса (курсора) в заданном поле
function getFocusPos(e){
	var pos = 0;
	if($.browser.msie){
		var r = e.document.selection.createRange();
		r.moveStart('textedit', -1);
		pos = r.text.length;
	
	}else{
		pos = e.selectionEnd;// находим порядковый номер окончания выделения
	}
	return pos;
}

// устанавливает позицию фокуса (курсора) в заданном поле
function setFocusPos(e, pos){
	if($.browser.msie){
		var r = e.createTextRange();// создаем на основе выделенного объект TextRange
		r.collapse(true);
		r.moveEnd('character', pos);// начальная позиция равна длинне нового текста
		r.moveStart('character', pos);//конечная позиция равна минусовой длинне вставляемого текста
		r.select();
	}else{
		e.setSelectionRange(pos,pos);
	}
}
// устанавливает обработчики событий на элемент(ы) для проверки валидации телефонного номера
function fieldPhone(e){
	// обработчики событий: когда пользователь отпускает, нажимает клавишу клавиатуры и когда поле теряет фокус (keyup keypress change)
	$(e).bind('keyup change', function(event){
	    phoneValid(this, event, true);
	});
}
// проверка валидации номера телефона введенного в заданное поле
function phoneValid(e, event_, endfocus){
	
	if(typeof(e.value)!="string" || event_.ctrlKey // Ctrl
	|| event_.keyCode=="13" // Enter
	|| event_.keyCode=="37" // вверх
	|| event_.keyCode=="38" // вправо
	|| event_.keyCode=="39" // вниз
	|| event_.keyCode=="40" // влево
	|| event_.keyCode=="8"// tab
	|| event_.keyCode=="16"){// Shift
		return false;
	}
	var numberFocusPos = getFocusPos(e);// получаем номер позиции фокуса
	var numberFocusPosSet = 0;// реальная позиция фокуса после трансформации числа
	var numberFocusPosI = 0;// номер символа в for
	var numberFocusPosRealNumber = 0;// реальный номер символа
	
	var str = e.value;// введенный пользователем номер
	var newstr = "";// исправленный номер
	var number_badge = 0;// цифровая позиция цифры номера
	var symbol = "";// переменная под символ
	var clear_number = "";// номер исключительно из цифр (без всяких других знаков)
	
	if(str.substr(0,1)==" "){ str = str.substr(1,100); }// удаление пробела в самом начале // нуля в самом начале ИЛИ str.substr(0,1)=="0" || 
	if(str.substr(str.length,1)==" "){ str = str.substr(0,(str.length-1)); }// удаление пробела в самом конце
	
	for(var i=0; i<str.length; i++){
		
		symbol = str.substr(i,1);
		
		if(symbol!=" " && isNaN(symbol)==false){// если цифра
			
			//~alert("i="+i+" | symbol="+symbol);
			
			clear_number += symbol;
			
			numberFocusPosI += 1;
			
		}
		
		if((i+1)==numberFocusPos && !numberFocusPosRealNumber){ numberFocusPosRealNumber = numberFocusPosI; }
	}
	//~alert(numberFocusPos+"=="+numberFocusPosRealNumber);
	// если в начале номера знак +, при этом следующая цифра не задана или являеся цифрой 7 или 3 (правильно записываемый номер или Украина)
	if(str.substr(0,1)=="+"){ newstr = "+"+newstr; }// && (str.substr(1,1)=="" || str.substr(1,1)=="7" || str.substr(1,1)=="3")
	
	for(var i=0; i<clear_number.length; i++){
		
		symbol = clear_number.substr(i,1);
		
		newstr += symbol;
		
		if((str.substr(0,1)=="8" || str.substr(0,2)=="+7") && clear_number.length<12){// исправление номеров с 8 или +7
			
			if(i==0){ newstr += " ("; }
			if(i==3){ newstr += ") "; }
			if(i==6){ newstr += "-"; }
			
		}else if(clear_number.substr(0,6)=="810380"){// исправление украинских номеров вида: 810380626743377 на 8-10-380 (6267) 43-377
			
			if(i==0 || i==2 || i==12){ newstr += "-"; }// тире
			if(i==9){ newstr += ")"; } // скобка )
			if(i==5 || i==9){ newstr += " "; }// пробелы
			if(i==5){ newstr += "("; } // скобка (
			
		}else if(clear_number.substr(0,3)=="380"){// исправление украинских номеров вида: +380930595377 на +380 (93) 059-5377
			
			if(i==7){ newstr += "-"; }// тире
			if(i==4){ newstr += ")"; } // скобка )
			if(i==2 || i==4){ newstr += " "; } // пробелы
			if(i==2){ newstr += "("; } // скобка (
			
		}else if(clear_number.substr(0,1)=="9" && clear_number.length=="10"){// исправление российских номеров вида: 9264215497 на +7 (926) 421-5497
			
			if(i==0){ newstr = "+7 (9"; }// тире
			if(i==2){ newstr += ") "; } // скобка ) с пробелом
			if(i==5){ newstr += "-"; }// тире
			
		}else if(clear_number.substr(0,1)=="7" && clear_number.length=="11"){// исправление российских номеров вида: 74957887706 на +7 (495) 788-7706
			
			if(i==0){ newstr = "+7 ("; }// тире
			if(i==3){ newstr += ") "; } // скобка ) с пробелом
			if(i==6){ newstr += "-"; }// тире
			
		}else{// неизвестный вид номера разделяем промежуточными тире
			if(i==2 || (i==5 && clear_number.length>7) || i==9 || i==13 || i==17){ newstr += "-"; }//
		}
		//~alert(numberFocusPosRealNumber+"=="+i+"--"+newstr+"=="+newstr.length);
		if((i+1) == numberFocusPosRealNumber && !numberFocusPosSet){
			//~alert(i+"=="+numberFocusPosRealNumber+"--"+newstr+"=="+newstr.length);
			numberFocusPosSet = newstr.length;
		}
	}
	// если фокус покидает поле, и на конце сформировавшегося номера знак - тире
	if(endfocus && newstr.substr((newstr.length-1),1)=="-"){ newstr = newstr.substr(0,(newstr.length-1)); }
	
	e.value = newstr;
	
	if(numberFocusPosRealNumber==0 && str.substr(0,1)=="+"){ numberFocusPosSet += 1; }// выставление фокуса после ввода знака +
	
	if(numberFocusPosSet){ setFocusPos(e, numberFocusPosSet); }//~alert("numberFocusPosSet="+numberFocusPosSet); 
	
	return false;
}

// проверка валидации данных введенных в заданное поле
function fieldValid(obj, type_check, message, field_name){// регулярки отдают true если срабатывает условие, и null в обратном случае
	
	if(obj && obj.length>1){ return "- Для поля "+field_name+" в функции fieldValid указано множество объектов одновременно"; }
	
	if(type_check==null || type_check=="" || typeof(type_check)=='undefined'){ return "- Для поля "+field_name+" не указан тип проверяемых данных"; }
	
	// типы возможных данных (те что ниже)
	var types = {"x":1,"w":1,"words":1,"n":1,"numbers":1,"d":1,"date":1,"p":1,"phone":1,"e":1,"email":1,"mail":1,"wn":1,"withoutNumbers":1,
	"ww":1,"withoutWords":1,"w1":1,"leter":1,"letter":1,"n1":1,"numeral":1,"b":1,"blank":1};
	
	if(!types[type_check]){ return "- Для поля "+field_name+" указан невозможный тип проверяемых данных"; }
	
	if(message==null || typeof(message)=='undefined' || message==""){
		message = "заполнено неправильно";
	}
	
	if(typeof(yaproFieldTrim)!="undefined" && yaproFieldTrim==true){
		var obj_value = $.trim(obj.value);// удаляю пробелы по сторонам
	}else{
		var obj_value = obj.value;
	}
	$(obj).val(obj_value);
	
	if(obj_value!="" && type_check){// если поле заполнено И указан type_check
		
		var x = null;// не проверять данные
		
		var w = words = /^[a-zа-я]+$/i;// слово
		
		var n = numbers = /^[0-9]+$/i;// число
		
		var d = date = /^[0-9\.\:\s]+$/i;// дата времени
		
		var p = phone = /^[0-9\-\(\)\s\+]+$/i;// номер телефона
		
		var e = email = mail = /^([\w\.\-]+)@([a-z0-9\-]+)\.([a-z0-9\-\.]+)$/i;// электронная почта
		
		var wn = withoutNumbers = /^[^0-9]+$/i;// отсутствие цифр в строке
		
		var ww = withoutWords = /^[^a-zа-я]+$/i;// отсутствие букв в строке
		
		var w1 = letter = leter = /[a-zа-я]+/i;// хотя бы одна буква в строке
		
		var n1 = numeral = /[0-9]+/i;// хотя бы одна цифра в строке
		
		var b = blank = /\s+/;// пробел - условие true: присутствие хотя бы 1 пробела, включая space, tab, form feed, line feed. Эквивалентно [ \f\n\r\t\v].
		
		var valid = obj_value.match(eval(type_check));// в случае успеха - возвращает true, в случае если совпадение не найдено - null
		
		if(valid==null || valid==" "){
			
			return message;
		}
	}
	return "";
}
// проверка обязательности заполнения поля
function fieldMust(obj, message, field_name){
	
	if(typeof(obj[0])!='object'){ return "- Поле не найдено\n"; }
	
	var name = $(obj[0]).attr("name"); if(name==null || name==""){ return "- Не указано имя поля!\n"; }
	
	var tagName = obj[0].tagName;
	
	if(tagName!="INPUT" && tagName!="TEXTAREA" && tagName!="SELECT"){
		return "- Поле "+field_name+" является элементом "+tagName+" и не поддается проверке!\n";
	}
	
	var error = "";
	
	var type = $(obj[0]).attr("type");
	
	if(tagName=="INPUT" && (type=="radio" || type=="checkbox") ){
		
		var field_checked = false;
		for(var i=0; i< $(obj).length; i++){
			if($(obj[i]).attr("checked")){ field_checked = true; }
		}
		if(field_checked==false){ error = message? message : "выберите подходящее"; }
		
	}else{//INPUT:text || TEXTAREA || SELECT
		
		if(typeof(yaproFieldTrim)!="undefined" && yaproFieldTrim==true){
			var obj_value = $.trim(obj[0].value);// удаляю пробелы по сторонам
		}else{
			var obj_value = obj[0].value;
		}
		$(obj).val(obj_value);
		
		if(obj_value=="" || obj_value=="0"){ error = message? message : "необходимо заполнить"; }
		
	}
	if(error!=""){
		return error+"\n";
	}else{
		return "";
	}
}
// Функция определения позиции элемента
function PosElement(e){
	if(typeof(e) != 'object') {e = document.getElementById(e);}
	var ww = e.offsetWidth, hh = e.offsetHeight;
	for (var xx = 0,yy = 0; e != null; xx += e.offsetLeft,yy += e.offsetTop,e = e.offsetParent);
	return {Left:xx, Top:yy, Right:xx + ww, Bottom:yy + hh}//--левый, верхний, правый, нижний
}
// добавляем функцию к jQuery
jQuery.fn.yaproField = function(field_name, type_check, message, td, padding_left, padding_top){
	
	if(typeof(this)!='object' || this.length<1 ){ alert("Указанная форма не найдена"); return ; }
	
	var o = $('[name="'+field_name+'"]', this);// находим объект
	
	if(typeof(o)!='object' || o.length<1 ){ alert("Поле с именем "+field_name+" не найдено"); return ; }
	
	if(!type_check){ alert("Поле с именем "+field_name+" не указан тип проверяемых данных"); return ; }
	
	if(typeof(type_check)=="object"){
		var must = (type_check["m"] || type_check["must"])? true : false;
		var valid = type_check["v"]? type_check["v"] : type_check["valid"];
	}else{
		if(type_check=="m" || type_check=="must"){
			var must = true;
			var valid = false;
		}else{
			var must = false;
			var valid = type_check;
		}
	}
	
	var t = "";
	
	if(must){ t += fieldMust(o, message, field_name); }
	
	if(t=="" && valid){ t += fieldValid(o[0], valid, message, field_name); }
	
	$("#yaproField"+field_name).remove();
	
	if(t!=""){
		$(this).yaproFieldHelp(field_name, t, td, padding_left, padding_top);
	}
	return t;// если t!="" значит поле заполнено неправильно - отдаем ошибку
};
jQuery.fn.yaproFieldHelp = function(field_name, t, td, padding_left, padding_top){
	
	var o = $('[name="'+field_name+'"]', this);// находим объект
	
	if(typeof(o)!='object'){ alert("Поле с именем "+field_name+" не найдено"); return ; }
	
	if(!t || t==""){ alert("Полю с именем "+field_name+" не указана подсказка"); return ; }
	
	$("#yaproField"+field_name).remove();
	
	var padding_left = padding_left? padding_left : 0;
	var padding_top = padding_top? padding_top : 0;
	
	var position = PosElement( td? $(o).closest("TD")[0] : o[0] );
	
	var help = $('<table border="0" cellpadding="0" cellspacing="0" id="yaproField'+field_name+'" class="yaproField" style="left: '+(position.Right + padding_left)+'px; top: '+(position.Top + padding_top)+'px;"><tr><td class="yaproFieldPointer"> </td><td class="yaproFieldHTML">'+t+'</td></tr></table>').data("yaproField", o[0]).click(function(){ $(o[0]).focus(); $(this).remove(); });
	
	$(document.body).prepend( help );
	
	return t;
};
// визуально пролистывает скроллбар окна к первому с ошибкой заполненненному элементу и выставляет фокус на нем
function srollToFirstError(){
	var error_element = $(".yaproField:last").data("yaproField");
	if(typeof(error_element)!='object'){ return ; }
	var position = PosElement( error_element );
	var scrollTop = document.body.scrollTop? document.body.scrollTop : document.documentElement.scrollTop;
	if(scrollTop > position.Top){
		if($.isFunction($.scrollTo)){// если подключен плагин scrollTo - http://flesler.blogspot.com/2007/10/jqueryscrollto.html
			$(window).scrollTo({top: (position.Top-30), left:0}, 800);// 800 - скорость прокрутки
		}else{
			scrollTo(0, position.Top-30);
		}
		error_element.focus();
	}
}
// Функции вывода описания ввода, пример: onFocus="foc(this)" onBlur="blu(this)" value="описание"
jQuery.fn.yaproFieldHelpVal = function(field_name, help){
	
	var o = $('[name="'+field_name+'"]', this);// находим объект
	
	if(typeof(o)!='object'){ alert("Поле с именем "+field_name+" не найдено"); return ; }
	
	if(!help || help==""){ alert("Полю с именем "+field_name+" не указана подсказка"); return ; }
	
	$(o).focus(function(){
		
		var d = $(this).data("yaproFieldHelpVal");
		
		if(!d || d==""){
			$(this).data("yaproFieldHelpVal", help);
		}
		if($(this).val()==d){
			$(this).val("");
		}
	}).blur(function(){
		if($(this).val()==""){
			$(this).val(help);
		}
	});
};
/*
Идеи: реализовать Min checkbox & Max checkbox
*/