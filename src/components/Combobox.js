import baseComponent from '../mixins/base-mixins'

export default {
	data () {
		return {
			isExpanding : false,
            isFocused : false,
			searchKeyword : '',
			pointerIndex: 0,
			selectedValue: null,
			searchList: [],
			searchListTotal: [],
			selectedPointerIndex: 0,
            // value: null,
		}
	},
    props: {
        list: {
            required: true
        },
        id: {
            required: true
        },
        value: {
            required: true,
			// I don't know validation for what? Current because this line make error, so i comment it
            // validator: function (value) {
            //     return value == null;
            // }
        },
		defaultValue: {
        	default: null
		},
        disabled: {
            type: Boolean
        },
        disableIcon: {
            type: Boolean
        },
        styleDefault: {
            type: Boolean,
            default: false
        },
        inputPlacehoder: {
            type: String
        },
        label:{
            type: String
        },
		ajaxSearchUrl: {
        	type: String,
			default: null
		},
		startLengthKey: {
        	type: Number,
			default: 0
		},
		formatList: {
			type: Object,
			default: null
		},
		dataPrefix: {
        	type: String,
			default: null
		},
		keyNameSearch: {
        	type: String,
			default: "key"
		},
		paramAjaxSearch: {
        	type: Object,
			default: null
		}
    },
	mixins: [baseComponent],
	created () {
        if (this.ajaxSearchUrl !== null && this.ajaxSearchUrl !== "") {
            this.searchListTotal = [];
            this.searchList = JSON.parse(JSON.stringify(this.searchListTotal));
		}
		else {
            this.searchList = JSON.parse(JSON.stringify(this.list));
            this.searchListTotal = JSON.parse(JSON.stringify(this.list));
		}

        if (this.defaultValue !== null) {
        	let value = this.defaultValue;
            let selectItem = this.searchListTotal.filter( item => item.id.toString() === value.toString());
            if (selectItem.length > 0){
                this.searchKeyword = selectItem[0].title;
                this.selectedValue = value;
            }
        }
	},
	watch: {
        searchListTotal(){
			this.searchList = JSON.parse(JSON.stringify(this.searchListTotal));
            if (this.ajaxSearchUrl === null || this.ajaxSearchUrl === "") {
                this.switchList(false);
            }
		},
		list() {
            if (this.ajaxSearchUrl === null || this.ajaxSearchUrl === "") {
                this.searchListTotal = JSON.parse(JSON.stringify(this.list));
                this.switchList(false);
            }
		},
        value(newValue){ // When model is updated we will update search keywords
			if(newValue == null){
				this.searchKeyword = '';
				return;
			}
            let newId = newValue ? newValue : '';
            let selectItem = this.searchListTotal.filter( item => item.id.toString() === newValue.toString());
            if (selectItem.length > 0){
                this.searchKeyword = selectItem[0].title;
            }
        },
		defaultValue(value) {
        	if (value !== null) {
                let selectItem = this.searchListTotal.filter( item => item.id.toString() === value.toString());
                if (selectItem.length > 0){
                    this.searchKeyword = selectItem[0].title;
                    this.selectedValue = value;
                }
			}
		},
        selectedValue(val) {
            this.$emit("input", val);
		}
	},
	computed : {
        isActive(){
            return (this.value != null || (this.searchKeyword !== null && this.searchKeyword !== ''));
        }
	},
	methods : {
		focusCombobox(event){
			this.switchList(true);
			$(event.target).select();
		},
		blurCombobox(event){
			// When blur outside input, always emit the selected value to model.
			// If user CLICK on ITEM, the click event will update again new value to model.
			// Close LIST after 500ms (waiting for CLICK event was handled)
			this.$emit("input", this.selectedValue);
			setTimeout( () => {
				this.switchList(false);
				if(this.selectedValue == null){
					this.searchList = JSON.parse(JSON.stringify(this.searchListTotal));
				}
                this.pointerIndex = this.selectedPointerIndex;
			},500);

		},
        switchList(openList = false){
            if (!this.disabled) {
                this.isExpanding = openList;
                this.isFocused = openList;
            }
        },
		selectItem(index){ // index item of searchList
			if(index == undefined || index == null){
				return;
			}

			if(index >= this.searchList.length){
				return;
			}

			this.pointerIndex = index;
			let id = this.searchList[index].id;
			this.selectedValue = id;
			this.searchKeyword = this.searchList[index].title;
		},
		toggleItem(id, index){
			this.selectedValue = id;
            this.selectedPointerIndex = index;
            this.switchList(false); // Close list
			this.searchKeyword = this.searchList[index].title;
		},
		hoverItem(index){ // Hover on item at (index) in searchList
			// this
		},
		searchAction (event) {
            let self = this;
			this.selectedValue = null;
			this.searchKeyword = event.target.value ? event.target.value : '';
			this.switchList(true); // Open dropdown list
			this.$emit('search-keywords', this.searchKeyword);
			let searchKey = this.searchKeyword.trim();
			if (this.ajaxSearchUrl !== null && this.ajaxSearchUrl !== "" && searchKey.length >= this.startLengthKey) {
				let urlSearch = this.ajaxSearchUrl + "?" + this.keyNameSearch + "=" + searchKey;
                this.$http.get(urlSearch, { params : this.paramAjaxSearch}).then(
                    (success) => {
                    	this.pointerIndex = null;
						let dataList = success.body[this.dataPrefix];
						this.searchListTotal = [];
						dataList.map(data => {
                            let tmp = {
                                id: self.formatListHtml(self.formatList.id, data),
                                html: self.formatListHtml(self.formatList.html, data),
                                title: self.formatListHtml(self.formatList.title, data),
                                icon: self.formatListHtml(self.formatList.icon, data)
                            }
                            this.searchListTotal.push(tmp);
						});
                        // this.searchList = JSON.parse(JSON.stringify(this.searchListTotal));
                    },
                    (response) => {

                    }
                )
			}
			else {
                this.searchList = this.searchListTotal.filter( item => {
                    return item.title != undefined && item.title != null ? item.title.toUpperCase().match(new RegExp('.*' + this.searchKeyword.toUpperCase() + '.*')) : false;
                });
			}
		},

        resolve(obj, path){
			path = path.split('.');
			let current = obj;
			while(path.length) {
				if(typeof current !== 'object') return undefined;
				current = current[path.shift()];
			}
			return current;
		},

		formatListHtml (str, data) {
			if (str !== null && str !== '') {
                let result = '';
                let preStr = str.split("{{");
                if (preStr.length > 0) {
                    let afterStr = preStr[1].split("}}");
                    let dataObj = this.resolve(data, afterStr[0]);
                    result = preStr[0] + dataObj + afterStr[1];
                }
                else result = eval(preStr);
                return result;
			}
			return str;
		},

		keypressAction (keyName, event){
			let pointerIndex = this.pointerIndex;
			this.selectedValue = null;
			switch (keyName) {
				case 'ArrowDown':
					if (this.pointerIndex == null || this.pointerIndex >= this.searchList.length - 1){
						pointerIndex = 0;
					} else {
						pointerIndex++;
					}
					this.selectedValue = this.searchList[pointerIndex].id;
					this.switchList(true);
					break;
				case 'ArrowUp':
					if (this.pointerIndex == null || this.pointerIndex == 0){
						pointerIndex = this.searchList.length-1;
					} else {
						pointerIndex--;
					}
					this.selectedValue = this.searchList[pointerIndex].id;
					this.switchList(true);
					break;
				case 'Enter':
					this.switchList(false);
					break;
				default:
					pointerIndex = null;
					this.selectedValue = null;
			}

			this.pointerIndex = pointerIndex;
			this.selectItem(pointerIndex);
			if(event!= null){
				event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
			}
		}
	}

}
