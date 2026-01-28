import { Form, Input, Select } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';

export default function ProductForm() {
    const [form] = Form.useForm(); // Form instance for setting fields
    const [uomOptions, setUomOptions] = useState([]); // State for UOM options
    const [uomLoading, setUomLoading] = useState(false); // State for UOM loading
    const [categoryOptions, setCategoryOptions] = useState([]); // State for category options
    const [categoryLoading, setCategoryLoading] = useState(false); // State for category loading

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoryLoading(true); // Set loading to true before API call
                const response = await axios.get(`${API_BASE_URL}/category/listAll`);
                const categoryData = response.data;

                // Assuming categoryData.result is an array of objects like [{ _id: "1", Name: "Category1" }, ...]
                const formattedCategoryOptions = categoryData?.result?.map((item) => ({
                    value: item._id, // Use _id as the value
                    label: item.Name, // Use Name as the display label
                    hs_code: item?.['HS Code'] || '', // Use Name as the display label
                })) || [];

                setCategoryOptions(formattedCategoryOptions); // Set the options for the category Select
                console.log("Category Options:", formattedCategoryOptions);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategoryOptions([]); // Clear options on error
            } finally {
                setCategoryLoading(false); // Set loading to false after API call
            }
        };

        fetchCategories();
    }, []); // Empty dependency array to run only on mount

    const handleCategoryChange = async (categoryId) => {
        let found_hs_Code = categoryOptions?.find(item => item.value == categoryId);
        if (categoryId) {
            try {
                setUomLoading(true); // Set loading to true before API call
                const response = await axios.get(`${API_BASE_URL}/user-fbr/uombyhscode?hs_code=${found_hs_Code?.hs_code}`);
                const uomData = response.data;

                // Assuming uomData.result is an array of objects like [{ uom: "kg" }, { uom: "liter" }, ...]
                const formattedUomOptions = uomData?.result?.map((item) => ({
                    value: item.description,
                    label: item.description,
                })) || [];

                setUomOptions(formattedUomOptions); // Set the options for the UOM Select
                console.log("UOM Options:", formattedUomOptions);

                // Optionally reset the UOM field
                form.setFieldsValue({ uoM: '' });
            } catch (error) {
                console.error("Error fetching UOM:", error);
                setUomOptions([]); // Clear options on error
                form.setFieldsValue({ uoM: '' });
            } finally {
                setUomLoading(false); // Set loading to false after API call
            }
        } else {
            // If no categoryId, clear UOM options and reset field
            setUomOptions([]);
            form.setFieldsValue({ uoM: '' });
        }
    };

    return (
        <>
            <Form.Item
                label={'Name: '}
                name="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={'Product Category:'}
                name="category"
                rules={[{ required: true, message: 'Please select a category' }]}
            >
                <Select
                    loading={categoryLoading}
                    options={categoryOptions}
                    className="w-full"
                    placeholder="Select a category"
                    onChange={handleCategoryChange} // Trigger UOM fetch on category change
                />
            </Form.Item>

            {/* <Form.Item
                label={'Description: '}
                name="description"
            >
                <Input />
            </Form.Item> */}

            <Form.Item
                label={'UOM (Unit of Measure): '}
                name="uom"
                rules={[{ required: true, message: 'Please select a unit of measure' }]}
            >
                <Select
                    loading={uomLoading}
                    options={uomOptions}
                    className="w-full"
                    placeholder="Select a unit"
                />
            </Form.Item>
        </>
    );
}