import request from '@/utils/request';
const baseUrl = import.meta.env.VITE_APP_BASE_API;
import { getToken } from '@/utils/auth';

/**
 * 查询运行中实例列表
 * @param query
 * @returns {*}
 */
export const getProcessInstanceRunningByPage = (query: object) => {
  return request({
    url: '/workflow/processInstance/getProcessInstanceRunningByPage',
    method: 'get',
    params: query
  });
};

/**
 * 查询已完成实例列表
 * @param query
 * @returns {*}
 */
export const getProcessInstanceFinishByPage = (query: object) => {
  return request({
    url: '/workflow/processInstance/getProcessInstanceFinishByPage',
    method: 'get',
    params: query
  });
};

/**
 * 通过流程实例id获取历史流程图
 */
export const getHistoryProcessImage = (processInstanceId: string) => {
  return baseUrl + `/workflow/processInstance/getHistoryProcessImage/${processInstanceId}` + '?Authorization=Bearer ' + getToken() + '&t' + Math.random()
};

/**
 * 获取审批记录
 * @param processInstanceId 流程实例id
 * @returns
 */
export const getHistoryRecord = (processInstanceId: string) => {
  return request({
    url: `/workflow/processInstance/getHistoryRecord/${processInstanceId}`,
    method: 'get'
  });
};

/**
 * 作废
 * @param data 参数
 * @returns
 */
export const deleteRuntimeProcessInst = (data: object) => {
  return request({
    url: `/workflow/processInstance/deleteRuntimeProcessInst`,
    method: 'post',
    data: data
  });
};

/**
 * 运行中的实例 删除程实例，删除历史记录，删除业务与流程关联信息
 * @param processInstanceId 流程实例id
 * @returns
 */
export const deleteRuntimeProcessAndHisInst = (processInstanceId: string) => {
  return request({
    url: `/workflow/processInstance/deleteRuntimeProcessAndHisInst/${processInstanceId}`,
    method: 'delete'
  });
};

/**
 * 已完成的实例 删除程实例，删除历史记录，删除业务与流程关联信息
 * @param processInstanceId 流程实例id
 * @returns
 */
export const deleteFinishProcessAndHisInst = (processInstanceId: string) => {
  return request({
    url: `/workflow/processInstance/deleteFinishProcessAndHisInst/${processInstanceId}`,
    method: 'delete'
  });
};

/**
 * 分页查询当前登录人单据
 * @param query
 * @returns {*}
 */
export const getCurrentSubmitByPage = (query: object) => {
  return request({
    url: '/workflow/processInstance/getCurrentSubmitByPage',
    method: 'get',
    params: query
  });
};

/**
 * 撤销流程
 * @param processInstanceId 流程实例id
 * @returns
 */
export const cancelProcessApply = (processInstanceId: string) => {
  return request({
    url: `/workflow/processInstance/cancelProcessApply/${processInstanceId}`,
    method: 'post'
  });
};
