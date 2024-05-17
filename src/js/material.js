import { api } from './api';
import token from './api';
import checkAdmin from './admin';
import {snackbar} from "mdui/functions/snackbar";

let page = 1;
const size = 8;
let maxPage = 1;
function renderMaterialList(data) {
    const dialog = document.getElementById("deleteDialog");
    const dialogCancelBtn = document.getElementById('dialogCancelBtn');
    const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');
    const materialListTbody = document.getElementById('material-list-tbody');
    materialListTbody.innerHTML = ''; // 清空表格内容

    if (data && data.list) {
        maxPage = data.total / size;
        maxPage = Math.ceil(data.total / size);
        if (maxPage === 0) maxPage = 1;
        document.getElementById("pageText").textContent = "第" + page + "页，共" + maxPage + "页";
        if (data.list.length === 0) {
            materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">此页没有素材，请先上传</td></tr>';
            return;
        }
        data.list.forEach(item => {
            const tr = document.createElement('tr');

            // 文件名称
            const nameText = document.createElement('td');
            nameText.textContent = item["name"];
            tr.appendChild(nameText);

            // 文件类型
            const materialTypeText = document.createElement('td');
            if (item.type === "PIC") {
                materialTypeText.textContent = "图片";
            } else {
                materialTypeText.textContent = "视频";
            }
            tr.appendChild(materialTypeText);

            // 上传时间
            const uploadTime = new Date(item.uploadTime).toLocaleString();
            const tdUploadTime = document.createElement('td');
            tdUploadTime.textContent = uploadTime;
            tr.appendChild(tdUploadTime);

            // 文件大小
            const sizeInBytes = item.size;
            const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
            const tdSize = document.createElement('td');
            tdSize.textContent = sizeInMB + ' MB';
            tr.appendChild(tdSize);

            // 删除按钮
            const deleteButton = document.createElement('td');
            deleteButton.className = 'div';
            deleteButton.innerHTML = '<mdui-chip>删除</mdui-chip>';
            deleteButton.addEventListener('click', () => {
                dialog.open = true;
                dialog.description = item.name;
                dialogCancelBtn.addEventListener('click', () => {
                    dialog.open = false;
                });
                dialogConfirmBtn.addEventListener('click', () => {
                    dialog.open = false;
                    const params = {
                        id: item.id
                    };
                    fetch(api + '/material', {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token(),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok.');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.code === 200) {
                                snackbar({message: "删除成功"});
                                tr.parentNode.removeChild(tr);
                            } else {
                                snackbar({message: data.msg});
                            }
                        })
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);
                        });
                });
            });
            tr.appendChild(deleteButton);
            materialListTbody.appendChild(tr);
        });
    } else {
        materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">获取推流失败，请刷新列表</td></tr>';
    }
}

async function fetchMaterialLibrary() {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const url = api + `/material?${params.toString()}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token()}`
            }
        });
        return await response.json();
    } catch (error) {
        // 处理请求错误
        console.error('请求素材库时出错:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchMaterialLibrary()
        .then(data => {
            if (data && data.code === 401) {
                window.location.href = '../#login';
                return;
            }
            renderMaterialList(data);
        })
        .catch(error => {
            console.error('处理响应时出错:', error);
        });
    checkAdmin();

    document.getElementById('lastPageBtn')
        .addEventListener('click', function() {
            if (page > 1) {
                page --;
                refresh();
            } else {
                snackbar({message: "已经到尽头啦>.<"});
            }
        });
    document.getElementById('nextPageBtn')
        .addEventListener('click', function() {
            if (maxPage > page) {
                page ++;
                refresh();
            } else {
                snackbar({message: "已经到尽头啦>.<"});
            }
        });
    document.getElementById('logoutBtn')
        .addEventListener('click', function() {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userAdmin');
            window.location.href = '../';
        });
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadDialog = document.getElementById('uploadDialog');
    const uploadDialogCancelBtn = document.getElementById('uploadDialogCancelBtn');
    const uploadDialogConfirmBtn = document.getElementById('uploadDialogConfirmBtn');
    uploadDialogConfirmBtn.addEventListener('click', function() {
        fileInput.click();
        uploadDialog.open = false;
    });
    uploadDialogCancelBtn.addEventListener('click', function() {
        uploadDialog.open = false;
    });
    uploadBtn.addEventListener('click', function() {
        uploadDialog.open = true;
    });
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];

        if (file) {
            const maxFileSizeInBytes = 100 * 1024 * 1024;
            if (file.size > maxFileSizeInBytes) {
                snackbar({message: '文件大小不得超过100MB'});
            } else {
                snackbar({message: '正在上传，请耐心等待'});
                uploadBtn.loading = true;
                const formData = new FormData();
                formData.append('file', file);
                formData.append('name', file.name.replace(/\s/g, "_"));
                const headers = {
                    'Authorization': `Bearer ${token() || 'undefined'}`
                };

                // 发送POST请求
                fetch(api + '/material', {
                    method: 'POST',
                    headers: headers,
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok.');
                        }
                        return response.json(); // 或者根据API响应类型处理
                    })
                    .then(data => {
                        if (data.code === 200) {
                            snackbar({message: '上传成功'});
                            fetchMaterialLibrary()
                                .then(data => {
                                    renderMaterialList(data);
                                })
                                .catch(error => {
                                    console.error('处理响应时出错:', error);
                                });
                        } else {
                            snackbar({message: data.msg});
                        }
                        uploadBtn.loading = false;
                    });
            }
        } else {
            snackbar({message: "请选择要上传的文件"});
        }
    });
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', function() {
        refreshBtn.loading = true;
        refresh();
        refreshBtn.loading = false;
        snackbar({message: "刷新成功"});
    });
});

function refresh() {
    fetchMaterialLibrary()
        .then(data => {
            if (data.code === 200) renderMaterialList(data);
        });
}