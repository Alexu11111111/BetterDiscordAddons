//META{"name":"BetterNsfwTag"}*//

class BetterNsfwTag {
	initConstructor () {
		this.css = ` 
			.nsfw-tag {
				position: relative;
				overflow: hidden; 
				padding: 1px 2px 1px 2px; 
				margin-left: 5px; 
				height: 13px;
				border-radius: 3px;
				text-transform: uppercase;
				font-size: 12px;
				font-weight: 500;
				line-height: 14px;
				white-space: nowrap;
				color: rgb(240, 71, 71);
				background-color: rgba(240, 71, 71, 0.0980392);
				border: 1px solid rgba(240, 71, 71, 0.498039);
			}`;
			
		this.tagMarkup = `<span class="nsfw-tag">NSFW</span>`;
	}

	getName () {return "BetterNsfwTag";}

	getDescription () {return "Adds a more noticeable tag to NSFW channels.";}

	getVersion () {return "1.1.5";}

	getAuthor () {return "DevilBro";}

	//legacy
	load () {}

	start () {
		var libraryScript = null;
		if (typeof BDFDB !== "object" || BDFDB.isLibraryOutdated()) {
			if (typeof BDFDB === "object") BDFDB = "";
			libraryScript = document.querySelector('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js"]');
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js");
			document.head.appendChild(libraryScript);
		}
		this.startTimeout = setTimeout(() => {this.initialize();}, 30000);
		if (typeof BDFDB === "object") this.initialize();
		else libraryScript.addEventListener("load", () => {this.initialize();});
	}

	initialize () {
		if (typeof BDFDB === "object") {
			BDFDB.loadMessage(this);
			
			var observer = null;

			observer = new MutationObserver((changes, _) => {
				changes.forEach(
					(change, i) => {
						if (change.addedNodes) {
							change.addedNodes.forEach((node) => {
								if (node && node.classList && node.classList.contains(BDFDB.disCN.channelcontainerdefault)) {
									this.checkChannel(node);
								} 
								if (node && node.className && node.className.length > 0 && node.className.indexOf("container-") > -1) {
									this.checkContainerForNsfwChannel(node);
								} 
							});
						}
					}
				);
			});
			BDFDB.addObserver(this, BDFDB.dotCN.channels, {name:"channelListObserver",instance:observer}, {childList: true, subtree: true});
						
			this.checkAllContainers();
		}
		else {
			console.error(this.getName() + ": Fatal Error: Could not load BD functions!");
		}
	}

	stop () {
		if (typeof BDFDB === "object") {
			$(".nsfw-tag").remove();
						
			BDFDB.unloadMessage(this);
		}
	}
	
	onSwitch () {
		if (typeof BDFDB === "object") {
			this.checkAllContainers();
		}
	}
	
	
	// begin of own functions
	
	checkAllContainers () {
		document.querySelectorAll(BDFDB.dotCNS.channels + "[class*=container-]").forEach(container => {
			this.checkContainerForNsfwChannel(container);
		});
	}
	
	checkContainerForNsfwChannel (container) {
		container.querySelectorAll(BDFDB.dotCN.channelcontainerdefault).forEach(channel => {
			this.checkChannel(channel);
		});
	}
	
	checkChannel (channel) {
		let channelData = BDFDB.getKeyInformation({"node":channel,"key":"channel"});
		if (channelData && channelData.nsfw == true) {
			if (!channel.querySelector(".nsfw-tag")) {
				$(this.tagMarkup).appendTo(channel.querySelector(BDFDB.dotCN.channelname));
			}
		}
	}
}
