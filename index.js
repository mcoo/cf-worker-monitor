const html = `<!DOCTYPE html>
<html>
  <head>
  <title>Enjoy的博客监控</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet" type="text/css">
  <link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/quasar@1.15.21/dist/quasar.min.css" rel="stylesheet" type="text/css">
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    </head>
  
  <body>
  <div id="q-app">
  <template>
  <q-layout view="hhh lpR fff">
    <q-header elevated elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
          <q-avatar icon="fa fa-server">
          </q-avatar>
        <q-toolbar-title>
          Enjoy的博客监控
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
    <div class="row justify-center">
    <div class="col-12">
    <q-banner v-show="down" dense inline-actions class="text-white bg-red">
    服务器当前在宕机，请稍后再试...
    <template v-slot:action>
      <q-btn flat color="white" label="联系站长" @click="window.open('mailto:i@mcenjoy.cn')" />
    </template>
    </q-banner>
    </div>

    <div  class="col-md-10 q-pa-sm col-12">
    <q-card flat bordered class="q-ma-sm">
    <q-card-section>
    <div id="mypic" style="height:400px;">></div>
    </q-card-section>
    </q-card>
    <q-timeline class="q-ma-md" color="secondary">
      <template v-for="(v,i) in serverInfo.msg" :key="i">
      <q-timeline-entry
      title="服务器恢复"
      color="green"
      v-if='v.updated_time!="0000-00-00 00:00:00"'
      :subtitle="v.updated_time"
      icon="fa fa-check"
    >
    </q-timeline-entry>
  
      <q-timeline-entry
        title="服务器离线"
        color="red"
        icon="fa fa-times"
        :subtitle="v.created_time"
      >
        <div>
          {{ v.info }}
        </div>
      </q-timeline-entry>
      
    </template>
    </q-timeline>
    </div>
    </div>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
        <div class="text-center text-grey-3"><a target="_blank" href="https://mcenjoy.cn" >Enjoy的博客</a></div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>









  
</div>
    
    <script src="https://cdn.jsdelivr.net/npm/vue@^2.0.0/dist/vue.min.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.2.2/dist/echarts.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/quasar@1.15.21/dist/quasar.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/quasar@1.15.21/dist/lang/zh-hans.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/quasar@1.15.21/dist/icon-set/svg-fontawesome-v5.umd.min.js"></script>
    
    <script>
      Quasar.lang.set(Quasar.lang.zhHans)
      Quasar.iconSet.set(Quasar.iconSet.svgFontawesomeV5)
      new Vue({
        el: '#q-app',
        data: function () {
          return {
            "serverInfo": [],
            "myChart": null,
            "tab": "home",
            "down": false,
          }
        },
        methods: {
          getServerInfo: function () {
            var _this = this
            axios.get('/status', {
              headers: {'Accept':'application/json' }
            })
              .then(function (response) {
                if (response.data.code == 1) {
                  _this.serverInfo = response.data.data
                  for (i in _this.serverInfo.msg) {
                    if (_this.serverInfo.msg[i].updated_time=="0000-00-00 00:00:00") {
                      _this.down = true
                      break
                    }
                  }
                  console.log(_this.serverInfo)
                  var option = {
                      title: {
                        text: ''
                      },
                      tooltip: {
                        trigger: 'axis'
                      },
                      legend: {
                        data: [],
                        type: 'scroll',
                        orient: 'horizontal',
                      },
                      grid: {
                      },
                      xAxis: {
                        type: 'time',
                      },
                      yAxis: {
                        type: 'value',
                        name:'延时(ms)',
                        max: 2000,
                        min: 0,
                      },
                      dataZoom: [
                        {
                          type: 'slider',
                          xAxisIndex: 0,
                          filterMode: 'none'
                        },
                        {
                          type: 'slider',
                          yAxisIndex: 0,
                          filterMode: 'none'
                        },
                        {
                          type: 'inside',
                          xAxisIndex: 0,
                          filterMode: 'none'
                        },
                        {
                          type: 'inside',
                          yAxisIndex: 0,
                          filterMode: 'none'
                        }
                      ],
                      series: []
                    };
                  for (i in _this.serverInfo.history) {
                    option.legend.data.push(_this.serverInfo.history[i].name)
                    var sdata=[]
                    for (j in _this.serverInfo.history[i].data) {
                      sdata.push([_this.serverInfo.history[i].data[j].createtime,_this.serverInfo.history[i].data[j].responsetime])
                    }
                    option.series.push({
                      name: _this.serverInfo.history[i].name,
                      type: 'line',
                      data: sdata,
                      smooth: true
                    })
                  }
                  _this.myChart.setOption(option, true)
                }
               })
              .catch(function (error) {
                console.log(error);
              });
          },
        },
        mounted: function() {
          this.getServerInfo()
          this.myChart = echarts.init(document.getElementById('mypic'));
          window.addEventListener("resize", () => { this.myChart.resize();});
        }
      })
    </script>
  </body>
</html>`
const url = "https://dnsapi.cn/"

addEventListener("fetch", event => {
  try {
    const request = event.request
    return event.respondWith(handleRequest(event))
  } catch (e) {
    return event.respondWith(new Response("Error thrown " + e.message))
  }
})

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  return await response.json()
}




/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(event) {
  const request = event.request
  const cacheUrl = new URL(request.url)
  if (cacheUrl.pathname == "/status" ) {
    // Construct the cache key from the cache URL
    const cacheKey = new Request(cacheUrl.toString(), request)
    const cache = caches.default
    const res = {
      headers: {
        "content-type": "application/json",
      },
    }
    // Check whether the value is already available in the cache
    // if not, you will need to fetch it from origin, and store it in the cache
    // for future access
    let cresponse = await cache.match(cacheKey)
  
    if (!cresponse) {
      var details = {
        'login_token': token,
        'format': 'json',
        'monitor_id': monitor_id,
      };
    
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
      const init = {
        body: formBody,
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
  
      var response = await fetch(url+"Monitor.Getdowns", init)
      var results = await gatherResponse(response)
      var resjson = {"code": 0}
      resjson.data = {"msg": [],"history":[]}
      if (results.status.code == "1") {
        resjson.code = 1
        for (var i in results.monitor_downs) {
          resjson.data.msg.push({
            "host":results.monitor_downs[i].host,
            "created_time":results.monitor_downs[i].created_on,
            "updated_time":results.monitor_downs[i].updated_on,
            "info":results.monitor_downs[i].warn_reason,
          })
        }
      }
      response = await fetch(url+"Monitor.Gethistory", init)
      results = await gatherResponse(response)
      console.log(results)
      if (results.status.code == "1") {
        resjson.data.history
        for (var i in results.monitor_history) {
          var mdata = []
          for (var j in results.monitor_history[i].data.data) {
            if (j % 5 == 1) {
              mdata.push(results.monitor_history[i].data.data[j])
            }
          }
          resjson.data.history.push({
            "name": results.monitor_history[i].point_name,
            "data": mdata,
        })
        }
      }
      var newresponse = new Response(JSON.stringify(resjson), res)
      newresponse.headers.append("Cache-Control", "s-maxage=300")
      event.waitUntil(cache.put(cacheKey, newresponse.clone()))
      return newresponse
    }
    return cresponse   
  }else{
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    })
  }
}
