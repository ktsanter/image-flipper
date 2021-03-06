//
//
const app = function () {
	const API_BASE = 'https://script.google.com/macros/s/AKfycbw8ApLPHifjUm1NM12ek5cK2AoTvbVUrfUi_v9S4dtdpxzLeOPG/exec';
	const API_KEY = 'MVimageflipperAPI';

	const page = {
		"mainCardId": "ktsFlipperMainCard"
	};
	
	const settings = {
		"colorSchemeClasses": [
			'kts-flipper-colorscheme-000',
			'kts-flipper-colorscheme-001',
			'kts-flipper-colorscheme-002',
			'kts-flipper-colorscheme-003',
			'kts-flipper-colorscheme-004',
			'kts-flipper-colorscheme-005'
		]
	};
	
	//---------------------------------------
	// get things going
	//----------------------------------------
	function init () {
		page.contents = document.getElementById('contents');
		page.notice = document.getElementById('notice');
		
		if (!_initializeSettings()) {
			_setNotice('error in parameters');
		} else {
			_getConfiguration(_renderLayout);
		}
	}
	
	//-------------------------------------------------------------------------------------
	// query params:
	//-------------------------------------------------------------------------------------
	function _initializeSettings() {
		var success = false;
		var params = {};
				
		var urlParams = new URLSearchParams(window.location.search);
		params.configkey = urlParams.has('configkey') ? urlParams.get('configkey') : null;

		if (params.configkey != null) {
			settings.configkey = params.configkey;
			success = true;
		}
		
		return success;
	}
	
		
	//--------------------------------------------------------------
	// layout routines
	//--------------------------------------------------------------
	function _renderLayout() {
		var baseHTML = ""
			+ "<table class='kts-main-container'>"
			+ "  <tr>"
			+ "    <td>"
			+ "	      <table class='kts-flipper-table-title'>"
			+ "	         <tr>"
			+ "	           <td>"
			+ "		         <div id='ktsFlipperTitle' class='kts-flipper-title'> </div>"
			+ "		      </td>"
			+ "		      <td class='kts-flipper-control-cell'>"
			+ "		        <button id='ktsFlipperResetButton' class='kts-flipper-button'> reset </button>"
			+ "		      </td>"
			+ "	        </tr>"
			+ "	      </table>"
			
			+ "  	  <br/>"
			+ "	      <div id='ktsFlipperSubtitle' class='kts-flipper-subtitle'>"
			+ "	      </div>" 
			+ "	      <br/>"
			+ "	      <div class='kts-flipper-container'>"
			+ "	      <div id='ktsFlipperMainCard' class='kts-flipper-card'> </div>"
			+ "	      </div>"
			+ "    </td>"
			+ "  </tr>"
			+ "</table>";

		page.contents.innerHTML = baseHTML;
		page.contents.classList.add(settings.colorSchemeClasses[settings.config.colorscheme])
		
		_renderDescriptiveInfo();
		_loadMainCard();
		document.getElementById('ktsFlipperResetButton').addEventListener('click', _handleReset);
	}
	
	function _renderDescriptiveInfo() {
		document.getElementById('ktsFlipperTitle').textContent = settings.config.title;
		document.getElementById('ktsFlipperSubtitle').textContent = settings.config.subtitle;
	};
	
	function _loadMainCard() {
		var numItems = settings.config.images.length;
		var s = '';

		s += _loadFrontOfCard(numItems);
		s += _loadBackOfCard(numItems);

		document.getElementById(page.mainCardId).innerHTML = s;

		var cardButtons = document.getElementsByClassName('kts-flipper-card-button');
		for (var i = 0; i < cardButtons.length; i++) {
			cardButtons[i].addEventListener('click', function() {
				_flip(page.mainCardId, this.id);
			});
		}

		var cardBacks = document.getElementsByClassName('back');
		for (var i = 0; i < cardBacks.length; i++) {
			var back = cardBacks[i];
			back.style.visiblity = 'hidden';
			back.addEventListener('click', function () {
				_unflip();
			});
		}
	}
	
	function _loadFrontOfCard(numItems)	{
		var layoutRowsCols = {
			"9": [3, 3],
			"16": [4, 4],
			"20": [4, 5],
			"25": [5, 5],
			"30": [6, 5]
		};
		var layout = layoutRowsCols[numItems];
		if (layout == null) {
			console.log("no layout for this number of items: " + numItems);
			_setNotice('internal error - no layout for this number of items: ' + numItems);
			return;
		}
		
		var rows = layout[0];
		var cols = layout[1];
		
		var s = '';
		s += '<div id="card-front" class="front">'
		s += '<table class="kts-flipper-card-table">';
		for (var i = 0; i < numItems; i++) {
			if (i % cols == 0) s += '<tr>';
			var paddedNum = ("00" + i).slice (-2);
			var sid = ' id="ktsFlipperButton' + paddedNum + '" ';
			var sclass = ' class="kts-flipper-card-button" ';
			var text = (i+1);
			
			s += '<td>';
			s += '<button ' + sid + sclass + '>' + text + '</button>';
			s += '</td>';
			if (i % cols == cols - 1) s += '</tr>';
		}

		if (i % cols != 0) s += '</tr>';
		s += '</table>';
		s += '</div>';
		
		return s;
	}

	function _loadBackOfCard(numItems) {
		var s= '';
		  
		for (var i = 0; i < numItems; i++) {
			var paddedNum = ("00" + i).slice (-2);
			var sid = ' id="back' + paddedNum + '" ';
			var sclass = ' class="back" ';
			var scontent = 'back of card ' + (i+1);
			s += '<div ' + sid + sclass + '>' 
			s += '<img src="' + settings.config.images[i] + '" style="height:100%" />'; 
			s += '</div>';
		}
		  
		return s;
	}

	
	function _flip(id1, id2) {
		var cardBacks = document.getElementsByClassName('back');
		for (var i = 0; i < cardBacks.length; i++) {
			cardBacks[i].style.visibility = 'hidden';
		}
		document.getElementById('back' + id2.substring(id2.length-2)).style.visibility = 'visible';

		_toggleClass(document.getElementById(id1), 'flipped');
		document.getElementById(id2).style.visibility = 'hidden';
	}

	function _unflip() {
		_toggleClass(document.getElementById(page.mainCardId), 'flipped');
	}

	function _handleReset() {
		var cardButtons = document.getElementsByClassName('kts-flipper-card-button');
		for (var i = 0; i < cardButtons.length; i++) {
			cardButtons[i].style.visibility = 'visible';
		}

		var clist = document.getElementById(page.mainCardId).classList;
		if (clist.contains('flipped')) {
			clist.remove('flipped');
		}
	}	
		
	function _toggleClass(elem, className) {
		var clist = elem.classList;
		if (clist.contains(className)) {
			clist.remove(className);
		} else {
			clist.add(className);
		}
	}
			
	//--------------------------------------------------------------
	// build URL for use with Google sheet web API
	//--------------------------------------------------------------
		function _buildApiUrl (datasetname, configkey) {
		let url = API_BASE;
		url += '?key=' + API_KEY;
		url += datasetname && datasetname !== null ? '&dataset=' + datasetname : '';
		url += configkey && configkey !== null ? '&configkey=' + configkey : '';
		//console.log('buildApiUrl: url=' + url);
		
		return url;
	}
	
	//--------------------------------------------------------------
	// use Google Sheet web API to get course list
	//--------------------------------------------------------------
	function _getConfiguration (callback) {
		_setNotice('loading configuration...');

		fetch(_buildApiUrl('config', settings.configkey))
			.then((response) => response.json())
			.then((json) => {
				//console.log('json.status=' + json.status);
				if (json.status !== 'success') {
					_setNotice(json.message);
				}
				//console.log('json.data: ' + JSON.stringify(json.data));
				settings.config = json.data;
				_setNotice('');

				callback();
			})
			.catch((error) => {
				_setNotice('failed to load configuration for "' + settings.configkey + '"');
				console.log(error);
			})
	}	
	
	//---------------------------------------
	// utility functions
	//----------------------------------------
	function _setNotice (label) {
		page.notice.innerHTML = label;

		if (label == '') {
			page.notice.style.display = 'none'; 
			page.notice.style.visibility = 'hidden';
		} else {
			page.notice.style.display = 'block';
			page.notice.style.visibility = 'visible';
		}
	}
	
	return {
		init: init
 	};
}();