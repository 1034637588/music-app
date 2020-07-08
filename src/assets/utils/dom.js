export default {
    addClass(ele,className){
        if (this.hasClass) {
            return;
        } else {
            let newClass = ele.className.split(' ');
            newClass.push(className);
            ele.className = newClass.join(' ');
        }
    },
    hasClass(ele,className){
        let reg = new RegExp('(^|\\s)'+className+'(\\s|$)');
        return reg.test(ele,className);
    }
}