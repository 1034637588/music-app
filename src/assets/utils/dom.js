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
    },
    getData(ele,name,val){ //val为空就是获取 不为空就是设置
        name = `data-${name}`;
        if(!val){
           return ele.getAttribute(name);

        }else{
            ele.setAttribute(name,val);
        }

    }
}