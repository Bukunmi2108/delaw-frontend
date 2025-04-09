import {Editor, MultiForm} from '../../components'
import './DocumentContainer.css'

const DocumentContainer = () => {
  return (
    <>
      <div className='document-container'>
        <MultiForm />
        <Editor />

      </div>
    </>
  )
}

export default DocumentContainer