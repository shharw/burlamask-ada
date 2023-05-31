import './App.css';
import Slider from './Slider';
import { AiOutlineSearch } from 'react-icons/ai'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState, useEffect, ChangeEvent } from 'react'
import { ColorRing } from 'react-loader-spinner'

interface ImageData {
  id: string;
  link: string;
  withBtn: boolean;
}

interface ImageURL {
  id: string;
  link: string;
  key: string;
  withBtn: boolean;
}

function App(): JSX.Element {

  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);
  const [response, setResponse] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleApi = (): void => {
    console.log(imageURLs);
    console.log(images);

    setIsLoading(false);

    const res: ImageData[] = [];
    const formData = new FormData();
    images.forEach(img => formData.append('files', img))
    try {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        },
      };
      axios.post('http://localhost:3000/api/generate', formData, requestConfig).then((response: AxiosResponse<ImageData[]>) => {
        response.data.forEach(img => {
          res.push({ id: img.id, link: img.link, withBtn: true });
        });
        setResponse(res);
        console.log(res);
        console.log(response.data);
        setIsLoading(true);
      });
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: ImageURL[] = [];
    let key = 0;
    images.forEach((image, index) => newImageUrls.push({ id: String(index), link: URL.createObjectURL(image), key: String(key++), withBtn: false }));
    setImageURLs(newImageUrls);
  }, [images]);

  function onImageChange(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      setImages([...e.target.files]);
    }
  }

  return (
      <div className="App">
        <div className='content'>
          <header>
            <div className='logo'>
              <img src='https://static.vecteezy.com/system/resources/previews/009/890/267/original/cartoon-drawing-of-clown-character-free-png.png' alt="logo"></img>
              <div className='name'>BurlaMask</div>
            </div>
            <form className='search-bar'>
              <input type='text' placeholder='Search by description' />
              <AiOutlineSearch className='search-bar-icon' />
            </form>
          </header>
          {imageURLs.length ?
              <Slider
                  imageURLs={imageURLs as ImageData[]}
              />
              : <div className='defaulf'>Upload at least 2 photos</div>}
          <div className='upload-buttons'>
            <input id='file' type="file" multiple accept="image/*" onChange={onImageChange} />
            <label htmlFor='file'>Choose file</label>
            <button className='swap' onClick={handleApi}>SWAP</button>
          </div>
          {isLoading ? (
              <Slider imageURLs={response as ImageData[]} />
          ) : (
              <div className='loader'>
                <ColorRing
                    visible={true}
                    height={180}
                    width={180}
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                />
              </div>
          )}
        </div>
      </div>
  );
}

export default App;
