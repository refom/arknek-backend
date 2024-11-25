
const CreateGUID = () => {
    return String(
        Date.now().toString(32) + Math.random().toString(16)
    ).replace(/\./g, "")
}

const GetRoutesLayer = (path, layer) => {
    if (layer.method) {
        // console.log("==> Method")
        // console.log(layer)
        return [layer.method.toUpperCase() + " " + path];
    }
    else if (layer.route) {
        // console.log("==> Route")
        // console.log(layer)
        return GetRoutesLayer(path + Split(layer.route.path), layer.route.stack[0]);
    }
    else if (layer.name === "router" && layer.handle.stack) {
        // console.log("==> Start Router Stack")
        let routes = []
        let route_name = ""
        
        layer.handle.stack.forEach((stackItem, index) => {
            // console.log("===> Stack Item")
            // console.log(stackItem)
            // console.log("===> Routes Before")
            // console.log(routes)
            const split_regexp = Split(layer.regexp)
            if (index === 0) route_name = split_regexp.slice(1);
            // console.log(split_regexp)
            routes = routes.concat(GetRoutesLayer(path + split_regexp, stackItem))
            // console.log("===> Routes After")
            // console.log(routes)
        })
        
        // console.log("==> End Router Stack")
        // console.log(routes)
        routes.push(route_name)
        return routes
    }

    return []
}

const Split = (path) => {
    if (typeof path === "string") {
        // console.log("===> Path")
        // console.log(path)
        return path;
    }
    else if (path.fast_slash) {
        // console.log("===> Path Fast Slash")
        // console.log(path)
        return "";
    }
    else {
        // console.log("===> Path Regexp")
        // console.log(path)
        const match = path.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
        return match ? match[1].replace(/\\(.)/g, '$1') : '<complex:' + path.toString() + '>';
    }
}

const ShowApi = (app) => {
    // let api = {}

    app._router.stack.forEach(layer => {
        // console.log("=> Start Layer")
        // console.log(layer)
        
        const routes = GetRoutesLayer("", layer)
        if (routes?.length === 0) return
        if (routes?.length === 1) {
            console.log()
            console.log(routes)
            console.log()
            return
        }
        const api_name = routes.pop()
        console.log()
        console.log("===> " + api_name.toUpperCase())
        // console.log(routes)
        process.stdout.write(` - ${routes.join("\n - ")}`);
        console.log()
        // api[api_name] = routes
        // console.log(routes)
        // console.log("=> End Layer")
        // console.log()
    });

    // return api
};

export { CreateGUID, ShowApi }
