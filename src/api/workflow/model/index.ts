import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ModelForm, ModelQuery, ModelVO } from '@/api/workflow/model/types';

/**
 * 查询模型列表
 * @param query
 * @returns {*}
 */
export const listModel = (query: ModelQuery): AxiosPromise<ModelVO[]> => {
  return request({
    url: '/workflow/model/list',
    method: 'get',
    params: query
  });
};

/**
 * 新增模型
 * @param data
 * @returns {*}
 */
export const addModel = (data: ModelForm): AxiosPromise<void> => {
  return request({
    url: '/workflow/model/rest/models',
    method: 'post',
    data: data
  });
};

/**
 * 按id删除模型
 * @returns {*}
 * @param id 模型id
 */
export function delModel(id: string | string[]): AxiosPromise<void> {
  return request({
    url: '/workflow/model/' + id,
    method: 'delete'
  });
}

/**
 * 模型部署
 * @returns {*}
 * @param id 模型id
 */
export const modelDeploy = (id: string): AxiosPromise<void> => {
  return request({
    url: `/workflow/model/modelDeploy/${id}`,
    method: 'post'
  });
};
