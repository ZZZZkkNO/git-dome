function debounce(fn, time){
    let timer = null
    return function(){
        clearTimeout(timer)
        let args = arguments
        timer = setTimeout(() => {
            fn.apply(this, args)
        },time)
    }
}

module.exports = debounce