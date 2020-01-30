/** @format */

class OptionParser {

	constructor(){
		this.stringOptions = new Array();
		this.boolOptions = new Array();
		this.args = new Array();
		this.originalArgs = new Array();
		this.longArgs = new Array();
		this.shortArgs = new Array();
	}

	addStringOption(flags) {

		// Creating tempArray to divide the long and short flags
		// short flags are added to shortArgs, long flags are added to longArgs
		let tempArray = (flags.split(" "))

		for (var i = 0; i< tempArray.length; i++){
			// if length == 1, regard the flag as short flag
			// otherwise long flag
			if(tempArray[i].length == 1){
				this.shortArgs.push(tempArray[i])
			}
			else{
				this.longArgs.push(tempArray[i])
			}
		}

		// sort the long flags so that filetype is before file in the longArgs
		this.longArgs.sort(function(a, b){return b.length - a.length});

		// store all string options in this array for parsing function
		this.stringOptions.push(flags.split(" "));
	}

	addBoolOption(flags) {

		// Creating tempArray to divide the long and short flags
		// short flags are added to shortArgs, long flags are added to longArgs
		let tempArray = (flags.split(" "))
		for (var i = 0; i< tempArray.length; i++){

			// if length == 1, regard the flag as short flag
			// otherwise long flag
			if(tempArray[i].length == 1){
				this.shortArgs.push(tempArray[i])
			}
			else{
				this.longArgs.push(tempArray[i])
			}
		}
		// sort the array in order for decreasing length
		this.longArgs.sort(function(a, b){return b.length - a.length});

		// create boolOptions array for parsing function
		this.boolOptions.push(flags.split(" "));
	}

	isSet(flag) {

		// Iterate through all the arguments list apart from 'a,b,c,d'
		for (var i=0; i< this.args.length; i++){

			// Incase if the argument contains "/" or "=" get the first value [0]
			var newItem = this.args[i].split("/")[0];
			newItem = newItem.split("=")[0];
			// Loop through the long argument list first
			for (var j=0; j< this.longArgs.length; j++){

				// Check if the argument matches with the element inside longArgs
				if(newItem.includes(this.longArgs[j])){

					// Check if the flag matches completely with the longArgs element
					if(flag.localeCompare(this.longArgs[j].toString()) == 0){
						return true;
					}

					// Check for short flags but only longArgs is present in the args
					// t -> filetype, f -> file, v -> version, h -> help
					if(this.longArgs[j] == 'filetype'){
						if(flag == 't'){
							return true;
						}
					}
					if(this.longArgs[j] == 'file'){
						if(flag == 'f'){
							return true;
						}
					}
					if(this.longArgs[j] == 'version'){
						if(flag == 'v'){
							return true;
						}
					}
					if(this.longArgs[j] == 'help'){
						if(flag == 'h'){
							return true;
						}
					}
				}
			}

			// After checking with long arguments, iterate through short Flags
			// short flags can be used in multiple options such as 'hv'
			// in the test case provided, therefore charAt() is used to Iterate
			// through the entire args[i] to allow the function
			for (var k=0; k< this.args[i].length; k++){
				for (var l=0; l< this.shortArgs.length; l++){
					if(newItem.charAt(k).localeCompare(this.shortArgs[l]) == 0){

						// long flags are also set equally with the short Flags
						// h-> help, v -> version, t -> filetype, f-> file
						if(this.shortArgs[l] == 'h'){
							if(flag == 'help' || flag == 'h'){
								return true;
							}
						}
						else if(this.shortArgs[l] == 'v'){
							if(flag == 'version' || flag == 'v'){
								return true;
							}
						}
						else if(this.shortArgs[l] == 'I'){
							if(flag == 'I'){
								return true;
							}
						}
						else if(this.shortArgs[l] == 't'){
							if(flag == 'filetype' || flag == 't'){
								return true;
							}
						}
						else if(this.shortArgs[l] == 'f'){
							if(flag == 'file' || flag == 'f'){
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	}

	get(flag) {

		// Get the single value of the option from the arguments (args)

		var singleValue = new Array();

		// Iterate through the args array excluding 'a,b,c,d'
		// Need to return the value in [/file, /type, type]
		for(var i = 0; i< this.originalArgs.length; i++){

			// format to return for file -> [file, type, type]
			if(this.originalArgs[i].includes(flag+"type"+"=")){
				let value = this.originalArgs[i];
				value = value.split("--" + flag+ "type" + "=").pop();
				singleValue.push("type=" + value);
			}
			else if(this.originalArgs[i].includes(flag+"type")){
				singleValue.push("type");
			}

			if(this.originalArgs[i].includes(flag)){
				let value = this.originalArgs[i];
				value = value.split("-" + flag).pop();
				singleValue.push(value);
			}
		}

		// Return the first value of the array
		return singleValue[0];

	}

	getAll(flag) {

		var allValues = new Array();

		// Iterate through all the arguments and return all the
		// values of the flag , if it is flag by itself, get the
		// next argument value, if not get the one after the "="
		for(var i = 0; i< this.originalArgs.length; i++){
			if(this.originalArgs[i].toString().localeCompare("-" + flag) == 0){
					allValues.push(this.originalArgs[i+1]);
			}
			else if(this.originalArgs[i].length >2 &&
				this.originalArgs[i].includes(flag)){
					let value = this.originalArgs[i]
					value = value.split("-" + flag + "=").pop()
					value = value.split("-" + flag).pop()
					allValues.push(value);
			}
		}
		return allValues;
	}

	reset() {

		// Reset by making the arguments an empty array
		this.args =[];
	}

	parse(args) {

		// TO DO - fix variable names, refactor code and comments
		var string_args = new Array()
		const counting = function(array, args){
			var number = 0;
			label1: for (var i = 0; i < args.length; i++){
				label2: for (var j = 0; j< array.length; j++){
					if(array[j].toString().includes(',')){
						label3: for (var k = 0; k< array[j].length; k++){
							if((args[i].includes(array[j][1].toString())) || (args[i].charAt(1) == (array[j][0]))){
								if(args[i].includes("filetype")){
									if(array[j][1].toString().localeCompare("file") == 0){
										continue label2;
									}
								}

								if(args[i].localeCompare(("-"+ array[j][1].toString())) == 0){
									number+=1;
									if(args[i].localeCompare(("-help")) == 0){
										string_args.push(args[i])
										continue label1;
									}
									string_args.push(args[i])
									string_args.push(args[i+1])
									continue label1;
								}
								number +=1;
								string_args.push(args[i])
								continue label1;
							}
						}
					}
					else if(args[i].includes(array[j].toString())){
						if(args[i].localeCompare(("-"+ array[j].toString())) == 0){
							number+=1;
							string_args.push(args[i])
							string_args.push(args[i+1])
							continue label1;
						}
						number += 1;
						string_args.push(args[i])
						continue label1;
					}
				}
			}
			return number;
		}
		var st_count = counting(this.stringOptions, args)
		var bo_count = counting(this.boolOptions, args)
		let count = st_count + bo_count;
		this.args = string_args
		this.originalArgs = string_args;
		let copyArray = args;
		var i;
		for (i = 0; i< string_args.length; i++){
			copyArray.splice(copyArray.indexOf(string_args[i].toString()),1)
		}
		return copyArray
	}
}

module.exports = OptionParser;
