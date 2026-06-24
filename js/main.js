(function(){
  /* ---- タブ切替 ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = {
    core:    document.getElementById('core'),
    career:  document.getElementById('career'),
    creative:document.getElementById('creative')
  };

  function activate(name){
    tabs.forEach(function(t){ t.setAttribute('aria-selected', t.dataset.tab === name); });
    for(var k in panels){ panels[k].classList.toggle('on', k === name); }
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
  }

  tabs.forEach(function(t){
    t.addEventListener('click', function(){ activate(t.dataset.tab); });
  });

  /* ---- 波形の生成（暖→寒のスペクトラム） ---- */
  var g = document.getElementById('waveBars');
  if(g){
    var N=84, W=1000, gap=W/N, frag='';
    for(var i=0; i<N; i++){
      var x   = i*gap + gap*0.18;
      var env = 0.35 + 0.65*Math.pow(Math.sin(Math.PI*(i/(N-1))), 0.6);
      var s   = Math.sin(i*0.55)*0.5 + Math.sin(i*0.21+1.3)*0.32 + Math.sin(i*1.05)*0.18;
      var h   = (18 + (Math.abs(s)*0.7+0.3)*70) * env;
      var y   = 60 - h/2;
      frag += '<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'"'
            + ' width="'+(gap*0.5).toFixed(1)+'" height="'+h.toFixed(1)+'"'
            + ' rx="'+(gap*0.25).toFixed(1)+'" fill="url(#wg)"'
            + ' opacity="'+(0.5+env*0.5).toFixed(2)+'"/>';
    }
    g.innerHTML = frag;
  }

  /* ---- プレイヘッドの横断（reduced-motion では非表示） ---- */
  var ph     = document.getElementById('playhead');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(ph && !reduce){
    var t0 = null;
    function loop(ts){
      if(!t0) t0 = ts;
      var p = ((ts - t0) / 5200) % 1;   // 5.2秒で一周
      ph.setAttribute('cx', (p*1000).toFixed(1));
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  } else if(ph){
    ph.style.display = 'none';
  }
})();
