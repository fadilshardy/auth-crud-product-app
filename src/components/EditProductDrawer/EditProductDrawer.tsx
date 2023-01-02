import { Button, Drawer, Group, Space, TextInput } from '@mantine/core';

interface IEditModalFormProps {
    isLoading: boolean;
    handleCancel: () => void;
    isEdited: boolean;
    drawerForm: {
        name: string;
        price: number;
    }
    handleDrawerInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleProductUpdate: (event: React.FormEvent<HTMLFormElement>) => void;
}

const EditProductDrawer: React.FunctionComponent<IEditModalFormProps> = ({ isLoading, handleCancel, isEdited, drawerForm, handleDrawerInputChange, handleProductUpdate }) => {

    return <Drawer
        opened={isEdited}
        onClose={handleCancel}
        title="Edit"
        padding="xl"
        size="xl"
        position="right"
    >
        <form onSubmit={handleProductUpdate}>
            <Group grow>
                <TextInput
                    label="Name"
                    name="name"
                    value={drawerForm.name}
                    disabled={isLoading}
                    onChange={handleDrawerInputChange}
                    data-autofocus
                />
            </Group>
            <Group grow>
                <TextInput
                    label="Price"
                    name="price"
                    value={drawerForm.price}
                    onChange={handleDrawerInputChange}
                    disabled={isLoading}
                    data-autofocus
                />
            </Group>
            <Space h="md" />
            <Group grow>
                <Button variant="outline" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button type="submit">{isLoading ? "updating..." : "update"}</Button>
            </Group>
        </form>
    </Drawer>
        ;
};

export default EditProductDrawer;
