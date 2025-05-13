import React, { useState } from 'react';
import './Add.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {

    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Burger" // default category
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
        event.target.value = ''; // allow re-selection of the same file
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Please select an image!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", data.name.trim());
            formData.append("description", data.description.trim());
            formData.append("price", Number(data.price));
            formData.append("category", data.category);
            formData.append("image", image);

            const response = await axios.post(`${url}/api/food/add`, formData);

            if (response.data.success) {
                toast.success(response.data.message);

                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Burger"
                });
                setImage(null);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Something went wrong, please try again!');
        }
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={handleSubmit}>
                <div className='add-img-upload flex-col'>
                    <p>Upload Image</p>
                    <input 
                        type="file" 
                        accept="image/*" 
                        id="image" 
                        hidden 
                        onChange={handleImageChange} 
                    />
                    <label htmlFor="image">
                        <img 
                            src={image ? URL.createObjectURL(image) : assets.upload_area} 
                            alt="Upload Preview" 
                        />
                    </label>
                </div>

                <div className='add-product-name flex-col'>
                    <p>Product Name</p>
                    <input 
                        name='name' 
                        type="text" 
                        placeholder='Type here' 
                        value={data.name} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>

                <div className='add-product-description flex-col'>
                    <p>Product Description</p>
                    <textarea 
                        name='description' 
                        rows={6} 
                        placeholder='Write content here' 
                        value={data.description} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>

                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Product Category</p>
                        <select 
                            name='category' 
                            value={data.category} 
                            onChange={handleInputChange}
                        >
                            <option value="Burger">Burger</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                        </select>
                    </div>

                    <div className='add-price flex-col'>
                        <p>Product Price</p>
                        <input 
                            name='price' 
                            type="number" 
                            placeholder='25' 
                            value={data.price} 
                            onChange={handleInputChange} 
                            min="1"
                            required 
                        />
                    </div>
                </div>

                <button 
                    type='submit' 
                    className='add-btn'
                    disabled={!data.name || !data.description || !data.price || !image}
                >
                    ADD
                </button>
            </form>
        </div>
    );
};

export default Add;
