/*
    Vue.use(VueLazyLoade,{ //
        preLoade:1.3,
        loading
    })

    注册后就可以使用指令来懒加载
*/

function getScrollParent(el){ //这里获取到离它最近的可以滚动的父亲元素
    let parent = el.parentNode;
    while(parent){
        if(/(scroll)|(auto)/.test(getComputedStyle(parent).overflow)){
            return parent;
        }
        parent = parent.parentNode;
    }
}

function loadImageAsync(src,resolve,reject){
    let image = new Image();
    image.src = src;
    image.onload = resolve;
    image.onerror = reject;
}

const Lazy = (Vue) =>{ //这样封装的方法 都可以获得到vue

    class ReactiveElement { //为什么要搞成类 而不直接把el 放进入 因为方便扩展 好封装
        constructor({el,src,options}){
            this.src = src;
            this.el = el;
            this.options = options;
            this.state = {loading:false}
        }

        checkInOrNot(){ //检测自己是否在可视区域内
            let elementHeight = this.el.getBoundingClientRect().top; //距离视口的距离
            let bodyHeight = window.innerHeight * this.options.preLoad;
            return elementHeight < bodyHeight;
        }

        elRender(ele,state){
            let src = '';
            switch (state) {
                case 'loading':
                    src = ele.options.loading || '';
                    break;
                case 'finish':
                    src = ele.src;
                    break;
                default:
                    src = ele.options.loading || '';
                    break;
            }
            ele.el.src = src;
        }

        load(){ //加载图片
            //先加载loading图片
            //如果可显示了 就显示正常图片
            this.elRender(this,'loading');
            loadImageAsync(this.src,()=>{ //判断图片可不可以加载出来 可以的话 就渲染 
                this.state.loading = true;
                this.elRender(this,'finish');
            },()=>{
                this.elRender(this,'error');
            })

        }
    }

    return class LasyClass{
        constructor(options){
            this.options = options;
            this.isBinded = false;
            this.ElementQueue = []; //用来存放每一个图片元素的实例
        }

        handleLazyLoad(){ //触发滚动 循环检测图片是否显示
           //计算当前图片的所在盒子底边到body的上偏移 是否小于 浏览器底边到body的上偏移
            this.ElementQueue.forEach(element => {
                if(!element.state.loading){
                    let isIn = element.checkInOrNot();
                    isIn && element.load();
                }
            });
        }

        add(el,bindings,vnode){
            Vue.nextTick(()=>{
                //这里获取到离它最近的可以滚动的父亲元素
                let scrollParent = getScrollParent(el);
                if(scrollParent && !this.isBinded){ //然后给scrollParent 绑定事件
                    this.isBinded = true;
                    scrollParent.addEventListener('scroll', this.handleLazyLoad.bind(this)); //每次指令执行都绑定一个 所以要来个flage
                }

                //接下来就是滚动时判断 当前的元素是否在可视区域中 是的话就显示
                const imgElement = new ReactiveElement({ //创建执行懒加载的元素实例
                    el, //真实的元素
                    src:bindings.value,
                    options:this.options
                });
                this.ElementQueue.push(imgElement); //放到数组中保存 判断那些是在可视区域的
                this.handleLazyLoad();
            })
        }
    }
}

const VueLazyLoade ={
    install(Vue,options){
        const LasyClass = Lazy(Vue);
        const lazy = new LasyClass(options); //创建一个实例 里面封装了所需要的方法
        Vue.directive('lazy',{
            //把所有逻辑进行封装 类 ，把类封装到函数中
            bind:lazy.add.bind(lazy) //相当于 let a = lazy.add; a();  这样的话this可能就不是 lazy的实例了 所以要bind
        });
    }
}
export default VueLazyLoade;