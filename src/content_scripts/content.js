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

function escapeHTML(str) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function unescapeHTML(str) {
	var div = document.createElement("div");
	div.innerHTML = str.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g, "&nbsp;").replace(/\r/g, "&#13;").replace(/\n/g, "&#10;");
	return div.textContent || div.innerText;
}

var set_storage = (key, value) => {
	chrome.storage.local.set({[key]: value});
};

var remove_storage = key => {
	chrome.storage.local.remove(key);
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
	if ($icon_container == null) {
		return;
	}
	$icon_container.insertAdjacentHTML('beforeend', link_icon);
	var $icon = $icon_container.lastChild;
	$icon.addEventListener('click', on_click);
};

// URL取得
var get_url = jsdata => {
	var id_data = jsdata.split(';')[1];
	var type_and_room_id = id_data.split(',')[2].split('/');
	var type = type_and_room_id[0];
	var room_id = type_and_room_id[1];
	if (type == "space") {
		type = "room";
	}
	var message_id = id_data.split(',')[1];
	var url = "https://chat.google.com/" + type + "/" + room_id + "/" + message_id;
	return url;
};

// URLボタン
var put_url_button = e => {
	var jsdata = e.getAttribute("jsdata");
	var url = get_url(jsdata);
	var icon_svg = '<svg viewBox="0 0 24 24" class=" f8lxbf waxfdf ZnfIwf"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2z"></path><path d="M8 11h8v2H8z"></path></svg>';
	put_message_action_button(e, icon_svg, 'URLをコピー', e => {execCopy(url)});
};


var get_time_string = datetime => {
	var days = ['日', '月', '火', '水', '木', '金', '土'];

	var month = datetime.getMonth() + 1;
	var date = datetime.getDate();
	var day = days[datetime.getDay()];
	var hours = datetime.getHours();
	var minutes = ("0" + datetime.getMinutes()).slice(-2);
	return "" + month + "/" + date + "(" + day + ") " + hours + ":" + minutes;
};


// メッセージテキストを取得（絵文字も取得可能）
var get_message_text = e => {
	var innerHTML = e.querySelector('div[jsname="bgckF"]').innerHTML;
	var text = innerHTML.replace(/<img [^>]*data-emoji="([^">]*)"[^>]*>/g, '$1');
	text = text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ''); // remove HTML tag
	text = unescapeHTML(text);
	return text;
};


// ピン更新
var update_pins = (pins, option) => {
	var unpin_icon = '<svg viewBox="0 0 24 24" class="GfYBMd o50UJf"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.22L3.42 1.81L21.8 20.2L20.39 21.61L14.78 16H13V21L12 22L11 21V16H5V14L7 11V8.22L2 3.22ZM9 10.22V11.75L7.5 14H12.78L9 10.22Z"></path><path d="M19 14.5693L15 10.5671V4H8.43647L7.33397 2.8969C7.69315 2.35734 8.30687 2 9 2H15C16.11 2 17 2.89 17 4V11L19 14V14.5693Z"></path></svg>';

	var $pinned_banner = document.getElementById('pinned_banner');
	if (pins.length == 0) {
		$pinned_banner.classList.add('none');
		return;
	}
	$pinned_banner.classList.remove('none');

	pins = pins.slice(-option.maxpins); // 最新のmaxpins個だけ切り取る
	if (option['orderkey'] == 'timestamp') {
		pins.sort((a, b) => a.time - b.time);
	}
	if (option['order'] == 'descend') {
		pins = pins.reverse();
	}
	var $content = document.getElementById('pin_container');
	while ($content.firstChild) {
		$content.removeChild($content.firstChild);
	}

	for (var i = 0; i < pins.length; i++) {
		var pin = pins[i];
		let url = pin.url;
		var user = pin.user;
		var time = new Date(pin.time);
		var text = escapeHTML(pin.text);
		var datetext = get_time_string(time);

		var $li = document.createElement('li');
		$li.innerHTML = '<span>' + unpin_icon + '</span><span class="pin-content"><a href="' + url + '"><span class="user">' + user + '</span> ' + datetext + ' : ' + text + '</a></span>'

		if (i >= option.maxdisplays) {
			$li.classList.add('hide');
		}

		$li.querySelector('span').addEventListener('click', event => { // ピン止め解除ボタン
			chrome.storage.local.get('pin_memory', items => {
				var id2pins = items['pin_memory'];
				var room_id = get_room_id();
				id2pins[room_id] = id2pins[room_id].filter(p => p.url !== url);
				set_storage('pin_memory', id2pins);
				update_pins(id2pins[room_id], option);
			});
		});

		$content.append($li);
	}
	if (pins.length > option.maxdisplays) {
		document.getElementById('pinned_banner_button').classList.remove('hide');
	} else {
		document.getElementById('pinned_banner_button').classList.add('hide');
	}
};

// ピン止めボタン
var put_pinned_button = e => {
	var jsdata = e.getAttribute("jsdata");
	var url = get_url(jsdata);
	var user_name = e.querySelector('div[jsname="A9KrYd"] .njhDLd').textContent;
	var text = get_message_text(e);
	var time = e.getAttribute('data-created');
	time = +time;	// str to int
	var pin = {"url": url, "user": user_name, "time": time, "text": text};
	var icon_svg = '<svg viewBox="0 0 16 16" class=" f8lxbf waxfdf ZnfIwf"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.3 3.2L9.3 7.4L10.35 8.80002H5.64999L6.7 7.4L6.7 3.2L9.3 3.2ZM12 10V9L10.5 7V3.14286C10.5 2.51167 9.98833 2 9.35714 2H6.64286C6.01167 2 5.5 2.51167 5.5 3.14286L5.5 7L4 9V10H7.4L7.4 14L8 15L8.6 14L8.6 10H12Z"></path></svg>';

	put_message_action_button(e, icon_svg, 'ピン止め', e => {
		chrome.storage.local.get(null, items => {
			var id2pins = items['pin_memory'];
			if (id2pins == undefined) {
				id2pins = {};
			}
			var room_id = get_room_id();
			if (id2pins[room_id] == undefined) {
				id2pins[room_id] = [];
			}
			var pins = id2pins[room_id];
			pins = pins.filter(p => p.url !== pin.url);
			pins.push(pin);
			if (items['pin_message_option_excess'] == 'delete') {
				pins = pins.slice(-items['pin_message_option_maxpin']); // 最新のmaxpins個だけ切り取る
			}
			id2pins[room_id] = pins;
			update_pins(pins, {
				'maxpins':     items['pin_message_option_maxpin'],
				'maxdisplays': items['pin_message_option_maxdisplays'],
				'orderkey':    items['pin_message_option_orderkey'],
				'order':       items['pin_message_option_order']
			});
			set_storage('pin_memory', id2pins);
		});
	});
};

// ピン止めした時の上のバナー初期化
var put_pinned_banner = e => {
	var room_id = get_room_id();
	var banner = '<div class="pinned-banner none" id="pinned_banner"><input type="checkbox" id="toggle_pin_fold"><label class="pinned-banner-button" id="pinned_banner_button" for="toggle_pin_fold"></label><ul class="pin-container" id="pin_container"></ul></div>';
	e.insertAdjacentHTML('beforeend', banner);

	chrome.storage.local.get(null, items => {
		var id2pins = items['pin_memory'];
		if (id2pins !== undefined) {
			var pins = id2pins[room_id];
			if (pins != undefined) {
				update_pins(pins, {
					'maxpins':     items['pin_message_option_maxpin'],
					'maxdisplays': items['pin_message_option_maxdisplays'],
					'orderkey':    items['pin_message_option_orderkey'],
					'order':       items['pin_message_option_order']
				});
			}
		}
	});
};

// メッセージコピーボタン
var put_copy_button = e => {
	var text = get_message_text(e);
	var icon_svg = '<svg viewBox="0 0 24 24" class=" f8lxbf waxfdf ZnfIwf"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>';
	put_message_action_button(e, icon_svg, 'メッセージをコピー', e => {execCopy(text)});
};

// 画像を閉じる
var hold_images = (e, is_default_open, is_remember) => {
	$image_container = e.querySelector('div[jsname="KUOBaf"]');
	if ($image_container.hasChildNodes() == false) {
		return;
	}
	var $wrapper = $image_container.firstChild;
	var $inner = $wrapper.firstChild;
	var aria_label = $inner.firstChild.getAttribute('aria-label');
	if (typeof(aria_label) != "string" || aria_label.indexOf('画像') == -1) {
		return;
	}

	chrome.storage.local.get(null, items => {
		let id2isopen = items['hold_images_memory'] || {};
		let data_id = e.getAttribute('data-id');
		let is_open = is_remember && (data_id in id2isopen) ? id2isopen[data_id] : is_default_open;

		var $details = document.createElement('details');
		$details.open = is_open;
		$details.classList.add('hold-images');
		if (is_remember) {
			$details.addEventListener('toggle', event => {
				chrome.storage.local.get(null, items => {
					let id2isopen = items['hold_images_memory'];
					id2isopen[data_id] = $details.hasAttribute('open');
					set_storage('hold_images_memory', id2isopen);
				});
			});
		}
		var $summary = document.createElement('summary');
		$summary.textContent = "画像";
		$details.append($summary);
		$wrapper.append($details);
		$details.append($inner);
	});
};

// markdown
var markdown = (e, is_meta, is_bos_meta, is_quote_break, is_gchat_style, code_style, is_langname, is_highlight) => {
	var $textbox = e.querySelector('div[jsname="bgckF"]');
	if ($textbox == null) {
		return;
	}

	var innerHTML = $textbox.innerHTML;
	if (innerHTML == undefined) {
		return;
	}

	// GChatが自動挿入するハイパーリンクを削除
	innerHTML = innerHTML.replace(/<a href="(.*?)" target="_blank" dir="ltr" jslog="91781; 11:%.@.0]; track:vis" rel="noopener nofollow noreferrer" class="oiM5sf">(.*?)<\/a>/g, '[$2]($1)');
	var renderer = new marked.Renderer();
	renderer.link = (href, title, text) => {
		if (/^\[\S*\]\(\S+\)$/.test(href)) {
			href = href.replace(/^\[\S*\]\((\S+)\)$/, '$1');
		}
		if (title) {
			return '<a href="' + href + '" title="' + title + '" target="_blank" rel="noopener nofollow noreferrer" class="oiM5sf">' + text + '</a>';
		} else {
			return '<a href="' + href + '" target="_blank" rel="noopener nofollow noreferrer" class="oiM5sf">' + text + '</a>';
		}
	};

	if (is_gchat_style) {
		innerHTML = innerHTML.replace(/<span data-cd="hidden" class="jn351e">[*_~\s]+<\/span>/g, '');
	} else {
		innerHTML = innerHTML.replace(/<span data-cd="hidden" class="jn351e">([*_~])<\/span>\s*<b>(.*?)<\/b>\s*<span data-cd="hidden" class="jn351e">([*_~])<\/span>/g, '$1$2$3');
	}
	switch (code_style) {
		case 'gchat':
			innerHTML = innerHTML.replace(/<span data-cd="hidden" class="jn351e">[`\s]+<\/span>/g, '');
			break;
		case 'gfm':
			document.body.classList.add('markdown-code-style-gfm');
			innerHTML = innerHTML.replace(/<span data-cd="hidden" class="jn351e">([`\s]+)<\/span>/g, '$1');
			innerHTML = innerHTML.replace(/<span class="U8d2H">(.*?)<\/span>/g, '$1').replace(/<div class="FMTudf">([\s\S]*?)<\/div>/g, '$1');
			if (is_langname == false) {
				innerHTML = innerHTML.replace(/```([^\n])/, '```\n$1');
			}
			renderer.code = (code, language) => {
				code = unescapeHTML(code)
				if (hljs.getLanguage(language) == undefined) {
					code = language + code;
					language = '';
				}
				if (is_highlight) {
					if (language == '') {
						code = hljs.highlightAuto(code).value;
					} else {
						code = hljs.highlight(code, {language: language}).value;
					}
				}
				code = code.replaceAll('\n', '<br>');
				return '<pre' + '><code>' + code + '</code></pre>';
			};
			break;
		default:
			console.error('code_style = ' + code_style);
	}
	if (is_meta) {
		innerHTML = innerHTML.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
	} else if (is_bos_meta) {
		innerHTML = innerHTML.replace(/^&gt;/g, '>').replace(/\n&gt;/g, '\n>');
	}

	if (!is_quote_break) {
		innerHTML = innerHTML.replace(/(^|\n)>([^\n]*)\n([^>])/g, '$1>$2\n\n$3'); // 引用の改行を無効
	}

	marked.setOptions({headerIds: false, breaks: true, renderer: renderer});
	var marked_text = marked(innerHTML);
	if (code_style == 'gfm') {
		marked_text = marked_text.replaceAll('\n', '');
	}
	$textbox.innerHTML = marked_text;
};


var mathjax = e => {
	var $textbox = e.querySelector('div[jsname="bgckF"]');
	if ($textbox == null) {
		return;
	}

	var innerHTML = $textbox.innerHTML;
	if (innerHTML == undefined) {
		return;
	}
	innerHTML = innerHTML.replaceAll('<br>', '\n')
	innerHTML = innerHTML.replace(/(<\/?[^>]+>)|([^<]+)/g, (_, tag, content) => {	// HTMLタグ部とタグ内コンテンツ部にヒット
		if (tag !== undefined) {	// タグの場合は変更しないのでそのまま返す
			return tag;
		}
		if (content !== undefined) {	// コンテンツの場合は数式表現に置換
			content = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, text) => {
				text = text.replaceAll('&lt;', '<').replaceAll('&gt;', '>')
				return '<div align="center">' + MathJax.tex2svg(text).querySelector('svg').outerHTML + '</div>';
			});
			content = content.replace(/\$([^\n]+?)\$/g, (_, text) => {
				text = text.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
				return MathJax.tex2svg(text).querySelector('svg').outerHTML;
			});
			return content;
		}
		console.error('error');	// ここに来ることはないはず
		return ' ERROR ';
	});
	if ($textbox.innerHTML != innerHTML) {
		$textbox.innerHTML = innerHTML;
	}
};

// 絵文字のHTMLを得る
var get_emoji_html = (emoji) => {
	var data = window.emoji_to_codepoint[emoji];
	var label = data.label;
	var codepoint = data.img;
	var html = '<div class="eSFK6"><div role="menuitem" class="U26fgb mUbCce fKz7Od rtrXf M9Bg4d" jslog="85793" jscontroller="odQyk" jsaction="click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef;touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc(preventMouseEvents=true|preventDefault=true); touchcancel:JMtRjd;" jsshadow="" jsname="vnVdbf" aria-label="' + emoji + '" aria-disabled="false" tabindex="0" data-emoji="' + emoji + '" data-tooltip="' + label + '"><div class="VTBa7b MbhUzd" jsname="ksKsZd"></div><span jsslot="" class="xjKiLb"><span class="Ce1Y1c" style="top: -12px"><img data-emoji="' + emoji + '" class="iiJ4W" alt="' + emoji + '" aria-label="' + emoji + '" src="https://fonts.gstatic.com/s/e/notoemoji/13.1.1/' + codepoint + '/32.png"></span></span></div></div>';
	return html;
}

// よく使うリアクション
var freq_reaction = e => {
	var $fixed_bar = e.querySelector('div[jsname="OPTywb"]');
	var $container = $fixed_bar.querySelector('div[jsname="me23c"]');
	if ($container.hasChildNodes() == false) {
		setTimeout(() => freq_reaction(e), 20);
		return;
	}

	var all_emoji = [...Object.keys(window.emoji_to_codepoint)];

	chrome.storage.local.get(null, items => {
		var emoji2freq = items['reaction_freq_memory'] || {};
		let line_num = +(items['freq_reaction_line_num'] || "1");
		let favorite_reactions = [...new Set(items['favorite_reactions'] || '')].filter(x => x in emoji2freq);

		all_emoji.forEach(emoji => {
			if (emoji2freq[emoji] == undefined) {
				emoji2freq[emoji] = 0;
			}
		});
		set_storage('reaction_freq_memory', emoji2freq);


		if (line_num == 2) {
			e.style.height = '296px';
			e.style.top = '-296px';
		}
		let reaction_num = 9 * line_num;
		let sorted_reactions = all_emoji.sort((a, b) => emoji2freq[b] - emoji2freq[a]);
		let freq_reactions = sorted_reactions.filter(x => favorite_reactions.indexOf(x) == -1);
		var top_n = favorite_reactions.concat(freq_reactions).slice(0, reaction_num);

		// 元の絵文字ボタンを削除
		while ($container.firstChild) {
			$container.removeChild($container.firstChild);
		}
		top_n.forEach(emoji => {
			var innerHTML = get_emoji_html(emoji);
			$container.insertAdjacentHTML('beforeend', innerHTML);
		});
	});
};

// リアクション押下を監視する
var set_reaction_counter = e => {
	var emoji = e.getAttribute('data-emoji');
	e.addEventListener('click', event => {
		chrome.storage.local.get('reaction_freq_memory', items => {
			var emoji2freq = items['reaction_freq_memory'];
			emoji2freq[emoji] += 1;
			set_storage('reaction_freq_memory', emoji2freq);
		});
	});
};


// 仕様変更時の対応用
var init = () => {
	chrome.storage.local.get(null, settings => {
		var id2pins = settings['pin_memory'];
		if (id2pins != undefined) {
			Object.keys(id2pins).forEach(id => {
				var pins = id2pins[id]
				if (typeof(pins) == 'string') {
					pins = [{"url": pins, "user": '', "time": '', "text": '※アップデートにより仕様が変更されました。ここをクリックした後、ピンを一度解除し、再ピンしてください。'}];
					id2pins[id] = pins;
				}
			});
			set_storage('pin_memory', id2pins);
		}
	});

	// 改名等で不要になったキーの削除
	// remove_storage('pin_message_option_maxshow')
};


var main = () => {
	init();

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

		if (settings["markdown"]) {
			document.body.classList.add("markdown");
		}

		if (settings["freq_reaction"]) {
			switch (settings["freq_reaction_line_num"]) {
				case "1": break;
				case "2": document.body.classList.add("freq-reaction-2"); break;
			}
		}

		var for_container = e => {
			if (settings["pin_message"]) {
				put_pinned_banner(e);
			}
		}

		var for_thread = e => {
			if (settings["sort_thread"]) {
				sort_thread(e);
			}
		};

		var for_message = e => {
			if (settings["message_url"]) {
				put_url_button(e);
			}

			if (settings["pin_message"]) {
				put_pinned_button(e);
			}

			if (settings["copy_message"]) {
				put_copy_button(e);
			}

			if (settings["hold_images"]) {
				let is_open_default = settings["hold_images_option"] == 'open';
				let is_remember = settings["hold_images_remember"] == 'remember';
				hold_images(e, is_open_default, is_remember);
			}

			if (settings["markdown"]) {
				var is_meta = settings["markdown_option_meta"] == 'meta';
				var is_bos_meta = settings["markdown_option_bos_meta"] == 'meta';
				var is_quote_break = settings["markdown_option_quote_break"] == 'true';
				var is_gchat_style = settings["markdown_option_style"] == 'valid';
				var code_style = settings["markdown_option_code"];
				var is_langname = settings["markdown_option_langname"] == 'on';
				var is_highlight = settings["markdown_option_highlight"] == 'on';
				markdown(e, is_meta, is_bos_meta, is_quote_break, is_gchat_style, code_style, is_langname, is_highlight);
			}

			if (settings["math"]) {
				mathjax(e);
			}

		};

		var for_reaction_popup = e => {
			if (settings["freq_reaction"]) {
				freq_reaction(e);
			}
		};

		var for_reaction = e => {
			if (settings["freq_reaction"]) {
				set_reaction_counter(e);
			}
		};

		var set_insertion = (query, callback) => {
			insertionQ(query).every(callback);
			[...document.querySelectorAll(query)].forEach(callback);
		};

		// チャット欄コンテナごと
		set_insertion('div[jsname="mUnMUb"]', for_container);

		// スレッドごと
		set_insertion('c-wiz[jsname="JT2yOd"]', for_thread);

		// メッセージごと
		set_insertion('div[jsname="Ne3sFf"][class~="nF6pT"]', for_message);

		// 画像ごと
		// set_insertion('div[jsname="KUOBaf"]', for_image);

		// リアクションポップアップごと
		set_insertion('c-wiz[jsname="ewwDod"]', for_reaction_popup);

		// リアクションごと
		set_insertion('div[jsname="vnVdbf"]', for_reaction);
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

