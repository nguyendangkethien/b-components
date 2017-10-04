import baseComponent from '../mixins/base-mixins'

export default {
	data () {
		return {
			isExpanding : false,
			searchList : [],
			pointerIndex : null, // Selecting index of list
			hoverIndex : null, // Position of cursor is hovering select item
			searchKeyword : ''
		}
	},
	mixins: [baseComponent],
	created () {
		this.searchList = this.list
	},
	props : ['list', 'value', 'disabled'],
	computed : {
		selected () { // Convert v-model to [] if it's null
			return this.value ? this.value : []
		},
		listClasses () {
			return (this.isExpanding ? "active" : "") + " b__multi__select__list"
		}
	},
	methods : {
		getSelectedList () { // Get selected with full information [ { id : .. , html : ... } ] 
			let selected = []
			this.selected.forEach( (id, index) => {
				let item = this.list.find((value) => value.id == id)
				if (item != undefined)
					selected.push(item)
			})
        	return selected
		},
		toggleList () {
			this.switchList(!this.isExpanding)
		},
		switchList (on = true) {
			if (on)
				this.isExpanding = true
			else 
				this.isExpanding = false
		},
		toggleItem(id){
			let selectList = this.value == null ? [] : this.value;
			if (selectList.includes(id))
				selectList.splice(selectList.indexOf(id), 1)
			else
				selectList.push(id)

			this.switchList(true)

			// Reset search keyword at input field
			this.searchKeyword = ''
			this.$el.querySelector('input.input-control').focus()
			this.focusInputAction('')

			this.$emit('input', selectList)
		},
		hoverItem(index){ // Hover on item at (index) in searchList
			// this
		},
		searchAction (keyword) {

			this.searchList = this.list.filter( (item, position) => {
				if (item.keywords == undefined || item.keywords == null)
					return false
				let regex = new RegExp('.*' + keyword.toLowerCase() +'.*')
				return item.keywords.toLowerCase().match(regex) 
			})
			this.searchKeyword = keyword
			this.switchList(true)
		},
		focusInputAction (keyword) {
			this.searchAction(keyword)
			this.switchList(true)
		},
		keypressAction (keyName){
			let pointerIndex = this.pointerIndex
			switch (keyName) {
				case 'ArrowDown':
				if (this.pointerIndex == null || this.pointerIndex >= this.searchList.length - 1){
					pointerIndex = 0
					break
				}

				pointerIndex++
				break
				case 'ArrowUp':
				if (this.pointerIndex == null || this.pointerIndex == 0){
					pointerIndex = this.searchList.length-1
					break
				}

				pointerIndex--
				break
				case 'BackSpace':
				pointerIndex = null
				if (this.value.length > 0 && this.searchKeyword.length == 0)
					this.value.splice(this.value.length-1,1)
			}

			this.hoverItem(pointerIndex)
			this.pointerIndex = pointerIndex
		}
	}

}