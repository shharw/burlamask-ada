import './App.css';
import Slider from './Slider';
import { AiOutlineSearch } from 'react-icons/ai'
import axios from 'axios';
import { useState, useEffect } from 'react'

function App() {

  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [response, setResponse] = useState([]);

  const handleApi = () => {
    console.log(imageURLs);
    console.log(images);

    const res = [];
    const formData = new FormData();
    images.forEach(img => formData.append('files', img))

    // for (const image of images) {
    //   formData.append('image', image.buffer, {
    //     filename: image.originalname,
    //     contentType: image.mimetype,
    //   });
    try {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        },
      };
      axios.post('http://localhost:3000/api/generate', formData, requestConfig).then((response) => {
        // console.log(response.data[0].link);
        // return response.data;
        response.data.forEach(img => {
          res.push(img.link);
        });
        setResponse(res);
        console.log(res);
      });
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach(image => newImageUrls.push(URL.createObjectURL(image)));
    setImageURLs(newImageUrls);
  }, [images]);

  function onImageChange(e) {
    setImages([...e.target.files]);
  }

  return (
      <div className="App">
        <div className='content'>
          <header>
            <div className='logo'>
              <img src='https://static.vecteezy.com/system/resources/previews/009/890/267/original/cartoon-drawing-of-clown-character-free-png.png'></img>
              <div className='name'>BurlaMask</div>
            </div>
            <form className='search-bar'>
              <input type='text' placeholder='Search by description' />
              <AiOutlineSearch className='search-bar-icon'></AiOutlineSearch>
            </form>
          </header>
          {imageURLs.length ?
              <Slider imageURLs={imageURLs}></Slider>
              : <div className='defaulf'>Upload al least 2 photos</div>}
          <div className='upload-buttons'>
            <input type="file" multiple accept="image/*" onChange={onImageChange} />
            <button className='swap' onClick={handleApi}>SWAP</button>
          </div>
          <Slider imageURLs={response}></Slider>
        </div>
      </div>
  );
}

export default App;