import { Button, DatePicker, Flex, Form, Input, Modal, Select, Upload, UploadProps, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { ProductGetById, ProductCreate, ProductUpdate } from "../../services/product.services";
import { UploadOutlined } from "@ant-design/icons";
import { ImgUpload } from "../../services/product.services";
import { getMenus } from "../../services/product.services";
import { getBrands } from "../../services/product.services";

import dayjs from "dayjs";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const ProductModel = (props: any) => {
    const [file, setFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [brands, setBrands] = useState<any[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [categories, setCategories] = useState<any[]>([]); 
    const [selectedCategory, setSelectedCategory] = useState<string>(""); // State lưu giá trị được chọn của danh mục
    const showModal = () => {
        setIsModalOpen(true);
    };
    const [form] = Form.useForm();
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleOk = () => {
        form
            .validateFields()
            .then(async (values: any) => {
                const dataPost = {
                    ...values,
                };
                if (file) {
                   await ImgUpload(file);
                }
                if (dataPost.product_Id) {
                    await ProductUpdate(dataPost);
                    props.fetchData();
                    setIsModalOpen(false);
                    props.handleCancel();
                    alert("Cập nhật thành công!");
                } else {
                    await ProductCreate(dataPost);
                    props.fetchData();
                    setIsModalOpen(false);
                    props.handleCancel();
                    alert("Thêm sản phẩm thành công!");
                }
            })
            .catch(() => {
                alert("Thông tin sản phẩm chưa đủ!");
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        props.handleCancel();
    };

    const fetchData = async (id: any) => {
        
        let idAsNumber = Number(id);
        // alert("id : "  + idAsNumber);
        // alert("typeof id: " + typeof (idAsNumber));
        let data = await ProductGetById(idAsNumber);
   

        form.setFieldsValue(data);
        
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const upload_props: UploadProps = {
        name: 'file',
        action: 'http://localhost:41624/api/User/upload',
        headers: {
            authorization: "Bearer " + user.token,
        },
        onChange(info) {
            if (info.file.status === 'done') {
                // alert("done");
                // alert(user.token);
                form.setFieldValue("picture", info.fileList[0].response.filePath);
            }
        },
    };

    useEffect(() => {
        form.resetFields();
        if (props.prodid !== "") {
            fetchData(props.prodid);
        }
        showModal();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getMenus(); 
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const data = await getBrands();
                setBrands(data);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };

        fetchBrand();
    }, []);

    return (
        <>
            <Modal
                title="Thông tin sản phẩm"
                style={{zIndex: 2000}}
                open={isModalOpen}
                cancelText={"Hủy bỏ"}
                okText={"Lưu lại"}
                width={"60vw"}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={(child) => {
                    return (
                        <>
                            <hr
                                style={{
                                    color: "#F8F3F3",
                                    marginTop: "5px",
                                    marginBottom: "5px",
                                }}
                            />
                            <Flex justify={"flex-end"} align="center" gap={8}>
                                {child}
                            </Flex>
                        </>
                    );
                }}
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    initialValues={{
                        status: 1, // Giá trị mặc định cho trạng thái sản phẩm
                        // createdDay: moment(), 
                    }}
                    style={{ maxWidth: "100%" }}
                    scrollToFirstError
                >
                    <Form.Item
                        style={{ visibility: "hidden" }}
                        name="product_Id"
                        label="Mã sản phẩm"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="cate_Id"
                        label="Mã danh mục"
                        rules={[
                            {
                                required: true,
                                message: "Mã danh mục không được để trống!",
                            },
                        ]}
                    >
                        {/* <InputNumber /> */}
                        <Select
                            onChange={(value) => setSelectedCategory(value)}
                            value={selectedCategory} // Hiển thị giá trị đã chọn trong select
                        >
                            {categories.map((category) => (
                                <Option key={category.cate_id} value={category.cate_id}>
                                    {category.cate_name} 
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="product_Name"
                        label="Tên sản phẩm"
                        rules={[
                            {
                                required: true,
                                message: "Tên sản phẩm không được để trống!",
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="unit"
                        label="Đơn vị"
                        rules={[
                            {
                                required: true,
                                message: "Đơn vị không được để trống!",
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="unit_Price"
                        label="Giá"
                        rules={[
                            {
                                required: true,
                                message: "Giá sản phẩm không được để trống!",
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        name="brandID"
                        label="Mã thương hiệu"
                        rules={[
                            {
                                required: true,
                                message: "Mã thương hiệu không được để trống!",
                            },
                        ]}
                    >
                        {/* <Input /> */}
                        <Select
                            onChange={(value) => setSelectedBrand(value)}
                            value={selectedBrand} // Hiển thị giá trị đã chọn trong select
                        >
                            {brands.map((brand) => (
                                <Option key={brand.brandID} value={brand.brandID}>
                                    {brand.brandName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity_In_Stock"
                        label="Số lượng trong kho"
                        rules={[
                            {
                                required: true,
                                message: "Số lượng trong kho không được để trống!",
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item label="Ảnh đại diện" name="picture">
                        <Upload {...upload_props}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>

                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                    >
                        <Select>
                            <Option value={1}>Active</Option>
                            <Option value={0}>Inactive</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea showCount maxLength={255} />
                    </Form.Item>

                    {/* <Form.Item
                        name="createdDay"
                        label="Ngày tạo"
                    >
                        <DatePicker format="DD/MM/YYYY" />
                    </Form.Item> */}
                </Form>

            </Modal>
        </>
    );
};
export default ProductModel;
