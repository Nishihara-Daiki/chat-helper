
var set_storage = (key, value) => {
	chrome.storage.local.set({[key]: value});
}

// input[type="checkbox"] 要素の id をすべて取ってくる
var get_keys = () => {
	return [...document.querySelectorAll('input[type="checkbox"]')].map(e => {return e.id});
};

// select 要素の id をすべて取ってくる
var get_opt_keys = () => {
	return [...document.querySelectorAll('select')].map(e => {return e.id});
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
	});

	document.getElementById("turn_on_all").onclick = () => {
		set_all(true);
	}

	document.getElementById("turn_off_all").onclick = () => {
		set_all(false);
	}
}

// デバッグ用
function storage() {
	chrome.storage.local.get(null, items => {
		console.log(items);
	});
}