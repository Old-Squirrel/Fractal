<div class="btn-group mt-2 mb-1"  role="group">
            <button class="btn"   id="start-btn" title="start">
                <i class="bi bi-play "> </i>
                </button>
            <button class="btn" id="stop-btn" title="stop">
                <i class="bi bi-pause-fill  "></i>
               
            </button>
            <button class="btn" id="clear-btn" title="clear">
                <i class="bi bi-eraser "></i>
                </button>
</div>
            <button class="btn-toggler" data-bs-toggle="collapse" data-bs-target="#fractal_dashboard__description" aria-expanded="false" aria-controls="fractal_dashboard__description" title="description">
                <i class="bi bi-three-dots-vertical"></i>
            </button>
            <div class="collapse" id="fractal_dashboard__description">
                {{$fractal->description ?? ''}}
            </div>