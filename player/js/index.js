document.addEventListener('DOMContentLoaded', function () {
	

	var source = 'https://baladshow.com/api/v1/video/1/manifest.mpd';
	var video = document.querySelector('video');

	// For more Shaka Player options, see: https://github.com/google/shaka-player
	if (shaka.Player.isBrowserSupported()) {
		// Install built-in polyfills
		shaka.polyfill.installAll();
		var shakaInstance = new shaka.Player(video);
		shakaInstance.load(source).then(function () {

			let qualities = shakaInstance.getVariantTracks();
			let defaultQuality = shakaInstance.getStats().height;
			let qualityArr = getQualityArr(qualities);
			qualityArr.push("Auto");
			let audioLanguages = shakaInstance.getAudioLanguagesAndRoles();
			let audioArr = getAudioArr(audioLanguages);

			shakaInstance.configure({abr:{enabled: false}});

			// For options (second argument) see: https://github.com/sampotts/plyr/#options
			//you want to pass qualities array to determine what qualities are accessible and set mulipleQualities to true
			// !!!!! you must set the default quality

			var player = new Plyr(video, {
				qualities: qualityArr,
				mpdFiles: qualities,
				quality:{default : defaultQuality , options : qualityArr},
				multipleQualities : true,
				settings : ["quality", "audio", "speed", "captions"],
				audio : {options : audioArr, audioLanguages, selected : audioArr[0]},
				shakaInstance,
			});
			// Expose player so it can be used from the console
			window.player = player;
		});
	} else {
		console.warn('Browser is not supported!');
	}

});

const getQualityArr = (qualities) => {
	qArr = [];
	qualities.forEach(element => {
		qArr.push(element.height);
	});
	return qArr;
}

const getAudioArr = (audios) => {
	aArr = [];
	audios.forEach(element => {
		aArr.push(element.language);
	});
	return aArr;
}