import { clerkClient } from "@clerk/nextjs/server";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import FormContainer from "@/components/FormContainer";

const ApprovalsListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const usersResponse = await (await clerkClient()).users.getUserList();

    // Filter for users who signed up but aren't approved yet
    // They should have a role in unsafeMetadata but NOT approved in publicMetadata
    const pendingUsers = usersResponse.data.filter((u) => {
        const pubMeta = u.publicMetadata as { approved?: boolean };
        const unsMeta = u.unsafeMetadata as { role?: string };
        return !pubMeta.approved && unsMeta.role;
    });

    const columns = [
        {
            header: "Username",
            accessor: "username",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Requested Role",
            accessor: "role",
        },
        {
            header: "Actions",
            accessor: "action",
        },
    ];

    const renderRow = (item: any) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="p-4">{item.username || "N/A"}</td>
            <td className="p-4">{item.emailAddresses[0]?.emailAddress}</td>
            <td className="p-4 capitalize">{item.unsafeMetadata.role}</td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <FormContainer
                        table="approval"
                        type="approve"
                        data={{
                            id: item.id,
                            username: item.username,
                            email: item.emailAddresses[0]?.emailAddress,
                            role: item.unsafeMetadata.role
                        }}
                    />
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Pending Approvals</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={pendingUsers} />
        </div>
    );
};

export default ApprovalsListPage;
