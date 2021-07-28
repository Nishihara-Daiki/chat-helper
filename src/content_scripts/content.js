// クリップボードにコピー
function execCopy(string){
	var t = document.createElement('textarea');
	t.value = string;
	t.selectionStart = 0;
	t.selectionEnd = t.value.length;
	t.style.position = 'fixed';
	t.style.top = '-1000px';
	document.body.appendChild(t);
	t.focus();
	var r = document.execCommand('copy');
	t.blur();
	document.body.removeChild(t);
	return r;
}

var set_storage = (key, value) => {
	chrome.storage.local.set({[key]: value});
};

var get_room_id = () => {
	$cwiz = document.querySelector('c-wiz');
	if ($cwiz != null) {
		var gid = $cwiz.getAttribute('data-group-id')
		if (gid != null) {
			return gid.split('/')[1];
		}
	}
	return null;
};

var sort_thread = () => {
	var $threads_container = document.querySelector('*[jsname="yoHpJ"]');
	var $threads = $threads_container.querySelectorAll('c-wiz[jsname="JT2yOd"]');
	// console.log($threads)
	// $threads.forEach($thread => {
	// 	$top_message = $thread.querySelector('div[jsname="Ne3sFf"]');
	// 	time = $top_message.getAttribute('data-created');
	// 	console.log(time)
	// });
};

// 要素eの中にボタンアイコンを追加する
// アイコンのSVGテキスト icon_svg:str 
// マウスホーバー時に表示するテキスト help_text:str
// クリック時のアクション on_click
var put_message_action_button = (e, icon_svg, help_text, on_click) => {
	// アイコン HTML を作る
	var create_icon_html = (icon_svg, help_text) => {
		return '<div role="button" class="U26fgb mUbCce fKz7Od orLAid PFn4wd M9Bg4d" jscontroller="VXdfxd" jsaction="click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef;touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc(preventMouseEvents=true|preventDefault=true); touchcancel:JMtRjd;" aria-disabled="false" tabindex="-1" data-tooltip="' + help_text + '" data-tooltip-horizontal-offset="0" data-tooltip-vertical-offset="-12"><div class="VTBa7b MbhUzd" jsname="ksKsZd" style="top: 17px; left: 12px; width: 28px; height: 28px;"></div><span jsslot="" class="xjKiLb"><span class="Ce1Y1c" style="top: -10px">' + icon_svg + '</span></span></div>';
	};
	var link_icon = create_icon_html(icon_svg, help_text);
	var $icon_container = e.querySelector('div[jsname="jpbBj"]');
	$icon_container.insertAdjacentHTML('beforeend', link_icon);
	var $icon = $icon_container.lastChild;
	$icon.addEventListener('click', on_click);
};

// URL取得
var get_url = jsdata => {
	var id_data = jsdata.split(';')[1];
	var room_id = id_data.split(',')[2].split('/')[1];
	var message_id = id_data.split(',')[1];
	var url = "https://chat.google.com/room/" + room_id + "/" + message_id;
	return url;
};

// URLボタン
var put_url_button = e => {
	var jsdata = e.getAttribute("jsdata");
	var url = get_url(jsdata);
	var icon_svg = '<svg viewBox="0 0 24 24" class=" f8lxbf waxfdf ZnfIwf"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2z"></path><path d="M8 11h8v2H8z"></path></svg>';
	put_message_action_button(e, icon_svg, 'URLをコピー', e => {execCopy(url)});
};


// URLを埋め込む
var embed_url = url => {
	var $pinned_banner = document.getElementById('pinned_banner');
	if ($pinned_banner != null) {
		$pinned_banner.classList.remove('none');
	}
	var $content = document.getElementById('pinned_banner_content');
	if ($content != null) {
		$content.innerHTML = '<a href="' + url + '">' + url + '</a>';
	}
};

// ピン止めボタン
var put_pinned_button = e => {
	var jsdata = e.getAttribute("jsdata");
	var url = get_url(jsdata);
	var icon_svg = '<svg viewBox="0 0 16 16" class=" f8lxbf waxfdf ZnfIwf"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.3 3.2L9.3 7.4L10.35 8.80002H5.64999L6.7 7.4L6.7 3.2L9.3 3.2ZM12 10V9L10.5 7V3.14286C10.5 2.51167 9.98833 2 9.35714 2H6.64286C6.01167 2 5.5 2.51167 5.5 3.14286L5.5 7L4 9V10H7.4L7.4 14L8 15L8.6 14L8.6 10H12Z"></path></svg>';
	put_message_action_button(e, icon_svg, 'ピン止め', e => {
		embed_url(url);
		chrome.storage.local.get('pin_memory', items => {
			var id2url = items['pin_memory'];
			var room_id = get_room_id();
			id2url[room_id] = url;
			set_storage('pin_memory', id2url);
		});
	});
};

// ピン止めした時の上のバナー初期化
var put_pinned_banner = e => {
	var room_id = get_room_id();

	var unpin_icon = '<svg viewBox="0 0 24 24" class="GfYBMd o50UJf"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.22L3.42 1.81L21.8 20.2L20.39 21.61L14.78 16H13V21L12 22L11 21V16H5V14L7 11V8.22L2 3.22ZM9 10.22V11.75L7.5 14H12.78L9 10.22Z"></path><path d="M19 14.5693L15 10.5671V4H8.43647L7.33397 2.8969C7.69315 2.35734 8.30687 2 9 2H15C16.11 2 17 2.89 17 4V11L19 14V14.5693Z"></path></svg>';
	var banner = '<div class="pinned-banner none" id="pinned_banner"><span id="unpin_icon">' + unpin_icon + '</span><span id="pinned_banner_content"></p></div>';
	e.insertAdjacentHTML('afterbegin', banner);

	var $unpin_icon = document.getElementById('unpin_icon');
	$unpin_icon.addEventListener('click', e => {	// ピン止め解除ボタン
		document.getElementById('pinned_banner').classList.add('none');
		chrome.storage.local.get('pin_memory', items => {
			var id2url = items['pin_memory'];
			id2url[room_id] = null;
			set_storage('pin_memory', id2url);
		})
	});

	chrome.storage.local.get('pin_memory', items => {
		var id2url = items['pin_memory'];
		if (id2url === undefined) {	// ストレージに何も登録されていなかったら
			set_storage('pin_memory', {[room_id]: null});
		}
		else {
			url = id2url[room_id];
			if (url === undefined) {	// ストレージに id2url はあるが、今回のルームは登録されていなかったら
				id2url[room_id] = null;
				set_storage('pin_memory', id2url);
			}
			else if (url != null) {		// url が登録されていたら
				embed_url(url);
			}
		}
	});
};

var main = () => {
	chrome.storage.local.get(null, settings => {
		if (settings["margin_removal"]) {
			switch(settings["margin_removal_option"]) {
				case "lv1": document.body.classList.add('margin-removal-1'); break;
				case "lv2": document.body.classList.add('margin-removal-2'); break;
				case "lv3": document.body.classList.add('margin-removal-3'); break;
			}
		}

		if (settings["bold_name"]) {
			document.body.classList.add('bold-name');
		}

		if (settings["hide_ogp"]) {
			switch(settings["hide_ogp_option"]) {
				case "hide_ogp_image": document.body.classList.add("hide-ogp-image"); break;
				case "hide_ogp_all":   document.body.classList.add("hide-ogp-all"); break;
			}
		}

		if (settings["hide_file_thumbnail"]) {
			document.body.classList.add("hide-file-thumbnail");
		}

		for_container = e => {
			if (settings["pin_message"]) {
				put_pinned_banner(e);
			}
		}

		for_thread = e => {
			if (settings["sort_thread"]) {
				sort_thread(e);
			}
		};

		for_message = e => {
			if (settings["message_url"]) {
				put_url_button(e);
			}

			if (settings["pin_message"]) {
				put_pinned_button(e);
			}
		};

		// チャット欄コンテナごと
		var CONTAINER_QUERY = 'div[jsname="mUnMUb"]';
		insertionQ(CONTAINER_QUERY).every(for_container);
		[...document.querySelectorAll(CONTAINER_QUERY)].forEach(for_container);

		// 各スレッドごと
		var THREAD_QUERY = 'c-wiz[jsname="JT2yOd"]';
		insertionQ(THREAD_QUERY).every(for_thread);
		[...document.querySelectorAll(THREAD_QUERY)].forEach(for_thread);

		// 各メッセージごと
		var MESSAGE_QUERY = 'div[jsname="Ne3sFf"][class~="nF6pT"]';
		insertionQ(MESSAGE_QUERY).every(for_message);
		[...document.querySelectorAll(MESSAGE_QUERY)].forEach(for_message);
	});
};

window.onload = main;

// if ( window !== undefined ) {
//     setTimeout(function(){
//         let injected = window.injected;
//         if ( injected === undefined ) {
//             inject();
//             window.injected = true;
//         }
//     }, 3500);
// }

