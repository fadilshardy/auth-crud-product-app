import { useCustom } from '@table-library/react-table-library/table';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { Product } from '../../types/Product';
import * as TYPES from '@table-library/react-table-library/types';
import {
    DEFAULT_OPTIONS,
    getTheme,
} from '@table-library/react-table-library/mantine';
import { usePagination } from '@table-library/react-table-library/pagination';
import { useSort } from '@table-library/react-table-library/sort';
import {
    Group, Pagination, TextInput, ActionIcon,
} from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSearch, IconEdit, IconCirclePlus } from '@tabler/icons'
import { useState } from 'react';
import EditModalForm from '../EditProductDrawer/EditProductDrawer';
import { createProduct, deleteProduct, updateProduct } from '../../lib/productsApi';
import DeleteModalProduct from '../DeleteModalProduct/DeleteModalProduct';
import AddProductModal from '../AddProductModal/AddProductModal';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
interface IDataTableProps {
    products: Product[] | any
}

const DataTable: React.FC<IDataTableProps> = ({ products }) => {
    const nodes = [...products];

    const [data, setData] = useState({ nodes });

    //* THEME *//

    const mantineTheme = getTheme({
        ...DEFAULT_OPTIONS,
        highlightOnHover: true,
    });
    const theme = useTheme(mantineTheme);


    //* Pagination *//

    const pagination = usePagination(data, {
        state: {
            page: 0,
            size: 10,
        },
        onChange: onPaginationChange,
    });
    function onPaginationChange(action: any, state: any) {
    }


    //* Search *//
    const [search, setSearch] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    useCustom('search', data, {
        state: { search },
        onChange: onSearchChange,
    });



    function onSearchChange() {
        const initialNodes = { nodes }
        setData({
            nodes: initialNodes.nodes.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
        }
        );
        pagination.fns.onSetPage(0);
    }

    //* Sort *//

    const sort = useSort(
        data,
        {
            onChange: onSortChange,
        },
        {
            sortIcon: {
                iconDefault: null,
                iconUp: <IconChevronUp />,
                iconDown: <IconChevronDown />,
            },
            sortFns: {
                ID: (array) => array.sort((a: any | number, b: any) => a.id - b.id),
                NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
                PRICE: (array) => array.sort((a, b) => a.price - b.price),
                CREATED_AT: (array) => array.sort((a, b) => a.created_at - b.created_at),

            },
        },
    );
    function onSortChange(action: any, state: any) {
    }


    //* Resize *//
    const resize = { resizerHighlight: '#dee2e6' };

    //* COLUMNS *//

    const COLUMNS: TYPES.Column[] = [
        { label: 'ID', renderCell: (item) => item.id, sort: { sortKey: 'ID' } },
        { label: 'Name', renderCell: (item) => item.name, sort: { sortKey: 'NAME' } },
        {
            label: 'Price', renderCell: (item) => {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(item.price);
            }, sort: { sortKey: 'PRICE' }
        },
        {
            label: 'Created At',
            renderCell: (item) => {
                const date = new Date(item.created_at);
                return date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            }, sort: { sortKey: 'CREATED_AT' }
        },
        {
            label: 'Edit',
            renderCell: (item) => (
                <div>
                    <ActionIcon
                        variant="light"
                        color="blue"
                        component="button"
                        onClick={() => {
                            setIsEdited(true);
                            setDrawerForm({
                                product_id: item.id,
                                name: item.name,
                                price: item.price
                            });
                        }}
                    >
                        <IconEdit />
                    </ActionIcon>
                </div >
            ),
            resize,
        },
        {
            label: 'Delete',
            renderCell: (item) => (
                <DeleteModalProduct isLoading={isLoading} handleProductDelete={handleProductDelete} product_id={item.id} />
            ),
            resize,
        },
    ];

    //* Edit Drawer *//

    const [isEdited, setIsEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [drawerForm, setDrawerForm] = useState({
        product_id: '',
        name: '',
        price: 0,
    });

    const handleDrawerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setDrawerForm({ ...drawerForm, [name]: value });
    };

    const handleCancel = () => {
        setIsEdited(false);
    };

    // CREATE PRODUCT
    const handleProductCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formTarget = event.target;
        // @ts-ignore
        const { name, price } = formTarget;
        const dataForm = { name: name.value, price: price.value }

        setIsLoading(true);
        try {
            const product = await createProduct(dataForm);
            data.nodes.push(product);
            setData(data);
            showNotification({
                title: 'Action succeed',
                message: 'Data was saved',
                color: 'teal',
                icon: <IconCheck size={16} />,
            });


        } catch (error) {
            console.error(error);
        } finally {

        }
    };

    // UPDATE PRODUCT
    const handleProductUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await updateProduct(drawerForm);
            showNotification({
                title: 'Action succeed',
                message: 'Data was updated',
                color: 'teal',
                icon: <IconCheck size={16} />,
            });
            setIsLoading(false);
            setIsEdited(false);
        } catch (error) {
            console.error(error);
        }

        const node = nodes.find((node) => node.id === drawerForm.product_id);
        const editedNode = { ...node, name: drawerForm.name, price: drawerForm.price };

        const index = nodes.indexOf(node);
        data.nodes[index] = editedNode;
        setData(data);
    };

    // DELETE MODAL
    const handleProductDelete = async (product_id: string) => {
        setIsLoading(true);
        try {
            await deleteProduct(product_id);
            showNotification({
                title: 'Action succeed',
                message: 'Data was saved',
                color: 'red',
                icon: <IconCheck size={16} />,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }

        data.nodes = nodes.filter(node => node.id !== product_id);
        setData(data);
    };


    return <>
        <Group mx={10}>
            <TextInput
                placeholder="Search Product"
                value={search}
                icon={<IconSearch />}
                onChange={handleSearch}
            />
            <AddProductModal handleProductCreate={handleProductCreate} isLoading={isLoading} />

        </Group>
        <CompactTable columns={COLUMNS} data={data} theme={theme} pagination={pagination} sort={sort} />
        <br />
        <Group position="right" mx={10}>
            <Pagination
                total={pagination.state.getTotalPages(data.nodes)}
                page={pagination.state.page + 1}
                onChange={(page) => pagination.fns.onSetPage(page - 1)}
            />
        </Group>
        <EditModalForm isLoading={isLoading} handleCancel={handleCancel} isEdited={isEdited} drawerForm={drawerForm} handleDrawerInputChange={handleDrawerInputChange} handleProductUpdate={handleProductUpdate} />


    </>;
};

export default DataTable;