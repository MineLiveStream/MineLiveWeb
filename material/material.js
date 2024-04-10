window.onload = function(){
    fetchMaterialLibrary(1, 30)
        .then(data => {
            renderMaterialList(data);
        })
        .catch(error => {
            console.error('处理响应时出错:', error);
        });
}

function renderMaterialList(data) {
    const dialog = document.getElementById("deleteDialog");
    const snackbar = document.querySelector(".example-snackbar");
    const dialogCancelBtn = document.getElementById('dialogCancelBtn');
    const dialogConfirmBtn = document.getElementById('dialogConfirmBtn');
    const materialListTbody = document.getElementById('material-list-tbody');
    materialListTbody.innerHTML = ''; // 清空表格内容

    if (data && data.list) {
        if (data.list.length === 0) {
            materialListTbody.innerHTML = '<tr><td colspan="6" class="mdui-text-center">目前没有素材，请先上传</td></tr>';
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
                                snackbar.textContent = "删除成功";
                                tr.parentNode.removeChild(tr);
                            } else {
                                snackbar.textContent = data.msg;
                            }
                            snackbar.open = true;
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

async function fetchMaterialLibrary(page = 1, size = 30) {
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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        // 处理请求错误
        console.error('请求素材库时出错:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const snackbar = document.querySelector(".example-snackbar");
    document.getElementById('logoutBtn')
        .addEventListener('click', function() {
        localStorage.removeItem('userToken');
        window.location.href = '../';
    });
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];

        if (file) {
            const maxFileSizeInBytes = 100 * 1024 * 1024;
            if (file.size > maxFileSizeInBytes) {
                snackbar.textContent = '文件大小不得超过100MB';
                snackbar.open = true;
            } else {
                snackbar.textContent = "正在上传，请耐心等待";
                snackbar.open = true;
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
                            snackbar.textContent = "上传成功";
                            snackbar.open = true;
                            fetchMaterialLibrary(1, 30)
                                .then(data => {
                                    renderMaterialList(data);
                                })
                                .catch(error => {
                                    console.error('处理响应时出错:', error);
                                });
                        } else {
                            snackbar.textContent = data.msg;
                            snackbar.open = true;
                        }
                        uploadBtn.loading = false;
                    });
            }
        } else {
            snackbar.textContent = "请选择要上传的文件";
            snackbar.open = true;
        }
    });
    document.getElementById('refreshBtn')
        .addEventListener('click', function() {
        fetchMaterialLibrary(1, 30)
            .then(data => {
                renderMaterialList(data);
            })
            .catch(error => {
                console.error('处理响应时出错:', error);
            });
        snackbar.textContent = "刷新成功";
        snackbar.open = true;
    });
});