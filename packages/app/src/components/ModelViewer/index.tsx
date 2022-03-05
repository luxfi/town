import React, { useEffect, useState, useRef } from 'react'
import '@google/model-viewer'

const ModelViewer = ({ glb = '/models/tigerteen.glb', usdz = '', zoom = 'auto', multiple = false }) => {
  useEffect(() => {
    return () => {}
  }, [])

  const ModelVie = `
      <model-viewer
        src=${glb}
        loading="eager"
        alt="A 3D model of an astronaut"
        shadow-intensity="1"
        camera-controls
        auto-rotate
        autoplay
        ar
        ar-modes="webxr scene-viewer quick-look"
        reveal="auto"
        max-field-of-view=${zoom}
        ></model-viewer>`

  return (
    <>
      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ModelVie }}></div>
    </>
  )
}

export default ModelViewer
