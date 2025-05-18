import {
    api
} from './api';
import token from './api';
import checkAdmin from './permission';
import {
    snackbar
} from "mdui/functions/snackbar";
import router from "@/router";

let page = 1;
const size = 9;
let maxPage = 1;

export default function init() {
    document.getElementById('topAppBar').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    const refreshMaterialBtn = document.getElementById('refreshMaterialBtn');
    refreshMaterialBtn.addEventListener('click', function() {
        refresh();
        snackbar({
            message: '刷新成功'
        });
    });
    fetchMaterialLibrary()
        .then(data => {
            if (data && data.code === 401) {
                router.push('/?login=1');
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
                page--;
                refresh();
            } else {
                snackbar({
                    message: "已经到尽头啦>.<"
                });
            }
        });
    document.getElementById('nextPageBtn')
        .addEventListener('click', function() {
            if (maxPage > page) {
                page++;
                refresh();
            } else {
                snackbar({
                    message: "已经到尽头啦>.<"
                });
            }
        });
    document.getElementById('logoutBtn')
        .addEventListener('click', function() {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userAdmin');
            router.push('/');
        });
    const uploadProgressDialog = document.getElementById('uploadProgressDialog');
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
            const maxFileSizeInBytes = 120 * 1024 * 1024;
            if (file.size > maxFileSizeInBytes) {
                snackbar({
                    message: '文件大小不得超过120MB'
                });
            } else {
                uploadBtn.loading = true;
                uploadProgressDialog.open = true;
                const formData = new FormData();
                formData.append('file', file);
                formData.append('name', file.name.replace(/\s/g, "_"));

                const xhr = new XMLHttpRequest();
                xhr.open('POST', api + '/material', true);
                xhr.setRequestHeader('Authorization', `Bearer ${token() || 'undefined'}`);

                xhr.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        document.getElementById('uploadProgress').value = percentComplete;
                    }
                };

                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const response = JSON.parse(xhr.responseText);
                        if (response.code === 200) {
                            snackbar({
                                message: '上传成功'
                            });
                            fetchMaterialLibrary()
                                .then(data => {
                                    renderMaterialList(data);
                                })
                                .catch(error => {
                                    console.error('处理响应时出错:', error);
                                });
                        } else {
                            snackbar({
                                message: response.msg
                            });
                        }
                    } else {
                        snackbar({
                            message: '上传失败，请重试'
                        });
                    }
                    uploadBtn.loading = false;
                    uploadProgressDialog.open = false;
                    document.getElementById('uploadProgress').value = 0;
                };

                xhr.onerror = function() {
                    snackbar({
                        message: '网络错误，请检查网络连接'
                    });
                    uploadBtn.loading = false;
                    uploadProgressDialog.open = false;
                    document.getElementById('uploadProgress').value = 0;
                };

                xhr.send(formData);
            }
        } else {
            snackbar({
                message: "请选择要上传的文件"
            });
        }
    });
}

function refresh() {
    const refreshMaterialBtn = document.getElementById('refreshMaterialBtn');
    refreshMaterialBtn.loading = true;
    fetchMaterialLibrary()
        .then(data => {
            if (data.code === 200) renderMaterialList(data)
        })
        .catch(error => {
            console.error('刷新错误:', error);
        })
        .finally(() => {
            refreshMaterialBtn.loading = false;
        });
}

function renderMaterialList(data) {
    document.getElementById('streamBtn').addEventListener('click', function() {
        router.push("/stream");
    });
    const dialog = document.getElementById("deleteDialog");
    const dialogCancelBtn = document.getElementById('dialogCancelBtn');
    const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');

    if (data && data.list) {
        maxPage = data.total / size;
        maxPage = Math.ceil(data.total / size);
        if (maxPage === 0) maxPage = 1;
        document.getElementById("countText").textContent = "已上传 " + data.total + " 个素材";
        document.getElementById("pageText").textContent = "第" + page + "页，共" + maxPage + "页";
        const container = document.getElementById("materialCardList");
        if (data.list.length === 0) {
            container.innerHTML = '<h3>此页没有素材，请先上传</h3>';
            return;
        }
        container.innerHTML = '';
        data.list.forEach(item => {
            const card = document.createElement('mdui-card');
            card.style = "width: 360px; background-color: rgba(var(--mdui-color-on-secondary-light, 0.8));";

            const content = document.createElement('div');
            content.style = "padding: 16px";

            const titleRow = document.createElement('div');
            titleRow.style = "display: flex; justify-content: space-between; align-items: center;";

            const name = document.createElement('div');
            name.textContent = item["name"];
            name.style = "font-size: 18px; font-weight: bold;";

            titleRow.appendChild(name);
            content.appendChild(titleRow);

            // 文件大小及上传时间
            const stats = document.createElement('div');
            const sizeInBytes = item.size;
            const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
            const uploadTime = new Date(item.uploadTime).toLocaleString();
            let typeText;
            if (item.type === "PIC") {
                typeText = "图片";
            } else {
                typeText = "视频";
            }
            stats.innerHTML = `
            <div style="font-size: 15px; color: gray;margin-top: 6px;">素材类型：${typeText || "未知"}</div>
            <div style="font-size: 15px; color: gray;">文件大小：${sizeInMB || 0} MB</div>
            <div style="font-size: 15px; color: gray;">上传时间：${uploadTime || "未知"}</div>
          `;
            stats.style = "margin-bottom: 8px;";
            content.appendChild(stats);

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
                                snackbar({
                                    message: "删除成功"
                                });
                                refresh();
                            } else {
                                snackbar({
                                    message: data.msg
                                });
                            }
                        })
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);
                        });
                });
            });
            content.appendChild(deleteButton);

            card.appendChild(content);
            container.appendChild(card);
        });
    } else {
        container.innerHTML = '<h3>获取推流失败，请刷新列表</h3>';
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