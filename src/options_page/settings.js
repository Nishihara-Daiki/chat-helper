
var set_storage = (key, value) => {
	chrome.storage.local.set({[key]: value});
}


var set_version = () => {
	var $version = document.getElementById('version');
	var version = chrome.runtime.getManifest().version;
	$version.textContent = version;
}

// input[type="checkbox"] 要素の id をすべて取ってくる
var get_keys = () => {
	return [...document.querySelectorAll('input[type="checkbox"]')].map(e => {return e.id});
};

// select 要素の id をすべて取ってくる
var get_opt_keys = () => {
	return [...document.querySelectorAll('select')].map(e => {return e.id});
}

// input[type="text"] 要素の id をすべて取ってくる
var get_free_text_keys = () => {
	return [...document.querySelectorAll('input[type="text"]')].map(e => {return e.id});
}

// すべての設定を (boolean) value にする
var set_all = value => {
	get_keys().forEach(key => {
		$input = document.getElementById(key)
		$input.checked = value;
		set_storage(key, value);
	});
};

window.onload = () => {
	set_version();
	chrome.storage.local.get(null, items => {
		// トグルスイッチボタンの設定
		get_keys().forEach(key => {
			// 保存されたパラメータに合わせてチェックボックス表示
			$input = document.getElementById(key);
			value = items[key];
			if (value === undefined) {
				value = false;
			}
			$input.checked = value;
			set_storage(key, value);

			// チェックボックス変更時のハンドラも登録しておく
			$input.onchange = e => {
				var key = e.currentTarget.id;
				var value = e.currentTarget.checked;
				set_storage(key, value);
			};
		});

		// select の設定
		get_opt_keys().forEach(key => {
			$select = document.getElementById(key);
			value = items[key];
			if (value === undefined) {
				value = $select.value;
			}
			$select.value = value;
			set_storage(key, value);

			$select.onchange = e => {
				var key = e.currentTarget.id;
				var value = e.currentTarget.value;
				set_storage(key, value);
			};
		});

		// inputテキスト
		get_free_text_keys().forEach(key => {
			$input = document.getElementById(key);
			value = items[key];
			if (value === undefined) {
				value = $input.value;
			}
			$input.value = value;
			set_storage(key, value);

			$input.oninput = e => {
				let key = e.currentTarget.id;
				let value = e.currentTarget.value;
				set_storage(key, value);
			}
		})
	});

	document.getElementById("turn_on_all").addEventListener('click', e => {
		set_all(true);
	});

	document.getElementById("turn_off_all").addEventListener('click', e => {
		set_all(false);
	});

	// 設定・メモリの削除	
	document.getElementById("reset_memory").addEventListener('click', e => {
		if (window.confirm("設定およびメモリをリセットしますか？\n拡張機能インストール時の状態に戻します。")) {
			chrome.storage.local.clear();
			location.reload();
		}
	});

	// リアクション履歴の削除	
	document.getElementById("delete_reaction_history").addEventListener('click', e => {
		if (window.confirm("リアクション履歴を削除しますか？")) {
			set_storage("reaction_freq_memory", {});
		}
	});

	// リアクション履歴の確認
	document.getElementById("popup_reaction_history").addEventListener('click', e => {
		chrome.storage.local.get("reaction_freq_memory", items => {
			var emoji_to_freq = items["reaction_freq_memory"];
			if (emoji_to_freq == undefined) {
				alert('no history');
				return;
			}
			var all_emoji = [...Object.keys(emoji_to_freq)];
			all_emoji.sort((a, b) => emoji_to_freq[b] - emoji_to_freq[a]);
			var s = '';
			all_emoji.forEach(emoji => {
				if (emoji_to_freq[emoji]) {
					s += emoji + ': ' + emoji_to_freq[emoji] + '    ';
				}
			});
			if (s == '') {
				s = 'no history';
			}
			alert(s);
		});
	});

	// 全てのピンを削除
	document.getElementById("delete_all_pins").addEventListener('click', e => {
		if (window.confirm("全てのピンを削除しますか？")) {
			set_storage("pin_memory", {});
		}
	});
}

// デバッグ用
function storage(clear=false) {
	if (clear) {
		chrome.storage.local.clear();
	}
	chrome.storage.local.get(null, items => {
		console.log(items);
	});
}
