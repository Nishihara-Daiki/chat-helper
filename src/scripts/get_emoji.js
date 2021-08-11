var create_emoji_to_codepoint_js = () => {
	var mouseover = document.createEvent("HTMLEvents");
	mouseover.initEvent('mouseover', true, true);
	var click = document.createEvent("HTMLEvents");
	click.initEvent('click', true, true);
	var emoji_to_codepoint = {};
	var colors = document.querySelectorAll('div[jsname="Dh2M6c"')
	colors.forEach(c => {
		c.dispatchEvent(click);
		var divs = document.querySelectorAll('div[jsname="jqtYtc"] div[jsname="vnVdbf"]');
		divs.forEach(e => {
			e.dispatchEvent(mouseover);
			var emoji = e.getAttribute('data-emoji');
			var label = e.getAttribute('data-tooltip');
			var img = e.querySelector('img').src.replace('https://fonts.gstatic.com/s/e/notoemoji/13.1.1/', '').replace('/32.png', '');
			emoji_to_codepoint[emoji] = {"label": label, "img": img};
		})
	});
	var result = JSON.stringify(emoji_to_codepoint).replaceAll('"label"', 'label').replaceAll('"img"', 'img').replaceAll('},', '},\n');
	console.log(result);
};

create_emoji_to_codepoint_js();
